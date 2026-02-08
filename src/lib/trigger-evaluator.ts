import type { StockData } from "./data-fetcher.js";
import type {
  Operator,
  PriceTrigger,
  FundamentalTrigger,
  SentimentTrigger,
} from "./watchlist-schema.js";

export interface Alert {
  ticker: string;
  metric: string;
  label: string;
  action: string;
  currentValue: number;
  threshold: number;
  fired: boolean;
  severity: "critical" | "warning" | "info";
}

function compare(actual: number, operator: Operator, threshold: number): boolean {
  switch (operator) {
    case "<": return actual < threshold;
    case ">": return actual > threshold;
    case "<=": return actual <= threshold;
    case ">=": return actual >= threshold;
    case "==": return actual === threshold;
  }
}

function severityForAction(action: string): "critical" | "warning" | "info" {
  if (action === "SELL") return "critical";
  if (action === "BUY" || action === "BUY_MORE") return "warning";
  return "info";
}

function getQuarterlyEntries(data: Record<string, Record<string, unknown>> | undefined): Record<string, unknown>[] {
  if (!data) return [];
  // EODHD returns quarterly data as { "2025-09-30": { ... }, "2025-06-30": { ... } }
  // Sort by date descending (most recent first)
  return Object.entries(data)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, v]) => v);
}

function extractMetricFromQuarter(quarter: Record<string, unknown>, metric: string, source: string): number | null {
  switch (metric) {
    case "operating_margin": {
      const opIncome = Number(quarter.operatingIncome ?? 0);
      const revenue = Number(quarter.totalRevenue ?? 0);
      if (revenue === 0) return null;
      return opIncome / revenue;
    }
    case "fcf": {
      return Number(quarter.freeCashFlow ?? null);
    }
    case "net_debt": {
      const longTermDebt = Number(quarter.longTermDebt ?? 0);
      const shortLongTermDebt = Number(quarter.shortLongTermDebt ?? 0);
      const cash = Number(quarter.cash ?? quarter.cashAndEquivalents ?? 0);
      return longTermDebt + shortLongTermDebt - cash;
    }
    case "current_ratio": {
      const currentAssets = Number(quarter.totalCurrentAssets ?? 0);
      const currentLiab = Number(quarter.totalCurrentLiabilities ?? 0);
      if (currentLiab === 0) return null;
      return currentAssets / currentLiab;
    }
    case "debt_equity": {
      const totalLiab = Number(quarter.totalLiab ?? 0);
      const equity = Number(quarter.totalStockholderEquity ?? 0);
      if (equity === 0) return null;
      return totalLiab / equity;
    }
    default:
      return null;
  }
}

function extractHighlightMetric(highlights: Record<string, unknown>, metric: string): number | null {
  switch (metric) {
    case "revenue_growth_yoy":
      return highlights.QuarterlyRevenueGrowthYOY != null
        ? Number(highlights.QuarterlyRevenueGrowthYOY)
        : null;
    case "earnings_growth_yoy":
      return highlights.QuarterlyEarningsGrowthYOY != null
        ? Number(highlights.QuarterlyEarningsGrowthYOY)
        : null;
    case "pe_ratio":
      return highlights.PERatio != null ? Number(highlights.PERatio) : null;
    case "dividend_yield":
      return highlights.DividendYield != null ? Number(highlights.DividendYield) : null;
    default:
      return null;
  }
}

function evaluatePriceTriggers(data: StockData, triggers: PriceTrigger[]): Alert[] {
  const alerts: Alert[] = [];
  const price = data.realTimePrice?.close;
  if (price == null) return alerts;

  for (const trigger of triggers) {
    const fired = compare(price, trigger.operator, trigger.value);
    alerts.push({
      ticker: data.ticker,
      metric: `price (${trigger.operator} ${trigger.value})`,
      label: trigger.label,
      action: trigger.action,
      currentValue: price,
      threshold: trigger.value,
      fired,
      severity: severityForAction(trigger.action),
    });
  }
  return alerts;
}

function getSourceData(data: StockData, source: string): Record<string, Record<string, unknown>> | undefined {
  switch (source) {
    case "income_statement": return data.incomeStatement;
    case "balance_sheet": return data.balanceSheet;
    case "cash_flow": return data.cashFlow;
    default: return undefined;
  }
}

function evaluateFundamentalTriggers(data: StockData, triggers: FundamentalTrigger[]): Alert[] {
  const alerts: Alert[] = [];

  for (const trigger of triggers) {
    // Highlights-based metrics
    if (trigger.source === "highlights") {
      if (!data.highlights) continue;
      const value = extractHighlightMetric(data.highlights, trigger.metric);
      if (value == null) continue;

      const fired = compare(value, trigger.operator, trigger.value);
      alerts.push({
        ticker: data.ticker,
        metric: trigger.metric,
        label: trigger.label,
        action: trigger.action,
        currentValue: value,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
      continue;
    }

    // Quarterly-based metrics
    const sourceData = getSourceData(data, trigger.source);
    const quarters = getQuarterlyEntries(sourceData);
    if (quarters.length === 0) continue;

    const quartersNeeded = trigger.quarters ?? 1;

    if (quartersNeeded > 1) {
      // Check N consecutive quarters
      const recentQuarters = quarters.slice(0, quartersNeeded);
      if (recentQuarters.length < quartersNeeded) continue;

      const values = recentQuarters.map((q) =>
        extractMetricFromQuarter(q as Record<string, unknown>, trigger.metric, trigger.source),
      );
      if (values.some((v) => v == null)) continue;

      const allMatch = values.every((v) => compare(v!, trigger.operator, trigger.value));
      const latestValue = values[0]!;

      alerts.push({
        ticker: data.ticker,
        metric: `${trigger.metric} (${quartersNeeded}Q)`,
        label: trigger.label,
        action: trigger.action,
        currentValue: latestValue,
        threshold: trigger.value,
        fired: allMatch,
        severity: severityForAction(trigger.action),
      });
    } else {
      // Single quarter (most recent)
      const value = extractMetricFromQuarter(
        quarters[0] as Record<string, unknown>,
        trigger.metric,
        trigger.source,
      );
      if (value == null) continue;

      const fired = compare(value, trigger.operator, trigger.value);
      alerts.push({
        ticker: data.ticker,
        metric: trigger.metric,
        label: trigger.label,
        action: trigger.action,
        currentValue: value,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }
  }

  return alerts;
}

function evaluateSentimentTriggers(data: StockData, triggers: SentimentTrigger[]): Alert[] {
  const alerts: Alert[] = [];

  for (const trigger of triggers) {
    if (trigger.metric === "insider_net_sells") {
      const transactions = data.insiderTransactions ?? [];
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      let sells = 0;
      let buys = 0;

      for (const tx of transactions) {
        const t = tx as Record<string, unknown>;
        const txDate = new Date(String(t.date ?? t.transactionDate ?? ""));
        if (txDate < threeMonthsAgo) continue;

        const type = String(t.transactionCode ?? t.transactionType ?? "").toUpperCase();
        if (type === "S" || type === "SALE") sells++;
        if (type === "P" || type === "PURCHASE") buys++;
      }

      const netSells = sells - buys;
      const fired = compare(netSells, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "insider_net_sells",
        label: trigger.label,
        action: trigger.action,
        currentValue: netSells,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }
  }

  return alerts;
}

export function evaluateTriggers(data: StockData): Alert[] {
  const config = data.config;
  return [
    ...evaluatePriceTriggers(data, config.price_triggers),
    ...evaluateFundamentalTriggers(data, config.fundamental_triggers),
    ...evaluateSentimentTriggers(data, config.sentiment_triggers),
  ];
}
