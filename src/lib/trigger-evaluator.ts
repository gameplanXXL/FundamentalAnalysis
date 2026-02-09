import type { StockData } from "./data-fetcher.js";
import type {
  PriceTrigger,
  FundamentalTrigger,
  SentimentTrigger,
  MarketTrigger,
} from "./watchlist-schema.js";
import { compare, severityForAction, type Alert } from "./trigger-utils.js";
export type { Alert } from "./trigger-utils.js";

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

function isCongressMember(title: string): boolean {
  const lower = title.toLowerCase();
  return lower.includes("congress") || lower.includes("senator") || lower.includes("representative");
}

interface TransactionCounts {
  corporateSells: number;
  corporateBuys: number;
  congressSells: number;
  congressBuys: number;
}

function countTransactions(transactions: unknown[]): TransactionCounts {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const counts: TransactionCounts = { corporateSells: 0, corporateBuys: 0, congressSells: 0, congressBuys: 0 };

  for (const tx of transactions) {
    const t = tx as Record<string, unknown>;
    const txDate = new Date(String(t.date ?? t.transactionDate ?? ""));
    if (txDate < threeMonthsAgo) continue;

    const title = String(t.ownerTitle ?? "");
    const code = String(t.transactionCode ?? t.transactionType ?? "").toUpperCase();
    const isSell = code === "S" || code === "SALE";
    const isBuy = code === "P" || code === "PURCHASE";

    if (isCongressMember(title)) {
      if (isSell) counts.congressSells++;
      if (isBuy) counts.congressBuys++;
    } else {
      if (isSell) counts.corporateSells++;
      if (isBuy) counts.corporateBuys++;
    }
  }

  return counts;
}

export interface MarketContext {
  fearGreedIndex?: number;
  fearGreedClassification?: string;
  vixLevel?: number;
}

function evaluateSentimentTriggers(data: StockData, triggers: SentimentTrigger[], marketContext?: MarketContext): Alert[] {
  const alerts: Alert[] = [];
  const transactions = data.insiderTransactions ?? [];
  const counts = countTransactions(transactions);

  for (const trigger of triggers) {
    if (trigger.metric === "insider_net_sells") {
      const netSells = counts.corporateSells - counts.corporateBuys;
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

    if (trigger.metric === "insider_net_buys") {
      const netBuys = counts.corporateBuys - counts.corporateSells;
      const fired = compare(netBuys, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "insider_net_buys",
        label: trigger.label,
        action: trigger.action,
        currentValue: netBuys,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }

    if (trigger.metric === "congress_buys") {
      const fired = compare(counts.congressBuys, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "congress_buys",
        label: trigger.label,
        action: trigger.action,
        currentValue: counts.congressBuys,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }

    if (trigger.metric === "news_sentiment_avg") {
      const news = data.recentNews;
      if (!news || news.length === 0) continue;
      const totalPolarity = news.reduce((sum, article) => sum + (article.sentiment?.polarity ?? 0), 0);
      const avgSentiment = totalPolarity / news.length;
      const fired = compare(avgSentiment, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "news_sentiment_avg",
        label: trigger.label,
        action: trigger.action,
        currentValue: avgSentiment,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }

    if (trigger.metric === "analyst_consensus_rating") {
      if (!data.analystRatings) continue;
      const rating = data.analystRatings.Rating;
      const fired = compare(rating, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "analyst_consensus_rating",
        label: trigger.label,
        action: trigger.action,
        currentValue: rating,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }

    if (trigger.metric === "analyst_target_vs_price_pct") {
      if (!data.analystRatings || !data.realTimePrice?.close) continue;
      const target = data.analystRatings.TargetPrice;
      const price = data.realTimePrice.close;
      if (price === 0) continue;
      const pctDiff = ((target - price) / price) * 100;
      const fired = compare(pctDiff, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "analyst_target_vs_price_pct",
        label: trigger.label,
        action: trigger.action,
        currentValue: pctDiff,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }

    if (trigger.metric === "fear_greed_index") {
      if (marketContext?.fearGreedIndex == null) continue;
      const fired = compare(marketContext.fearGreedIndex, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "fear_greed_index",
        label: trigger.label,
        action: trigger.action,
        currentValue: marketContext.fearGreedIndex,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }

    if (trigger.metric === "vix_level") {
      if (marketContext?.vixLevel == null) continue;
      const fired = compare(marketContext.vixLevel, trigger.operator, trigger.value);

      alerts.push({
        ticker: data.ticker,
        metric: "vix_level",
        label: trigger.label,
        action: trigger.action,
        currentValue: marketContext.vixLevel,
        threshold: trigger.value,
        fired,
        severity: severityForAction(trigger.action),
      });
    }
  }

  return alerts;
}

export function evaluateMarketTriggers(triggers: MarketTrigger[], marketContext: MarketContext): Alert[] {
  const alerts: Alert[] = [];

  for (const trigger of triggers) {
    let value: number | undefined;

    if (trigger.metric === "fear_greed_index") {
      value = marketContext.fearGreedIndex;
    } else if (trigger.metric === "vix_level") {
      value = marketContext.vixLevel;
    }

    if (value == null) continue;
    const fired = compare(value, trigger.operator, trigger.value);

    alerts.push({
      ticker: "MARKET",
      metric: trigger.metric,
      label: trigger.label,
      action: trigger.action,
      currentValue: value,
      threshold: trigger.value,
      fired,
      severity: severityForAction(trigger.action),
    });
  }

  return alerts;
}

export function evaluateTriggers(data: StockData, marketContext?: MarketContext): Alert[] {
  const config = data.config;
  return [
    ...evaluatePriceTriggers(data, config.price_triggers),
    ...evaluateFundamentalTriggers(data, config.fundamental_triggers),
    ...evaluateSentimentTriggers(data, config.sentiment_triggers, marketContext),
  ];
}
