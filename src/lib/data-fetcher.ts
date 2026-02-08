import { eodhd, type RealTimePrice } from "./eodhd-client.js";
import type { StockConfig, FundamentalTrigger, SentimentTrigger } from "./watchlist-schema.js";

const API_DELAY_MS = parseInt(process.env.MONITOR_API_DELAY_MS ?? "200", 10);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export interface StockData {
  ticker: string;
  config: StockConfig;
  realTimePrice?: RealTimePrice;
  highlights?: Record<string, unknown>;
  incomeStatement?: Record<string, Record<string, unknown>>;
  balanceSheet?: Record<string, Record<string, unknown>>;
  cashFlow?: Record<string, Record<string, unknown>>;
  insiderTransactions?: unknown[];
}

function needsSource(config: StockConfig, source: string): boolean {
  return config.fundamental_triggers.some((t: FundamentalTrigger) => t.source === source);
}

function needsInsider(config: StockConfig): boolean {
  return config.sentiment_triggers.some((t: SentimentTrigger) => t.metric === "insider_net_sells");
}

export async function fetchStockData(ticker: string, config: StockConfig, exchange: string): Promise<StockData> {
  const fullTicker = `${ticker}.${exchange}`;
  const data: StockData = { ticker, config };

  // Always fetch real-time price (needed for price triggers)
  if (config.price_triggers.length > 0) {
    data.realTimePrice = await eodhd.getRealTimePrice(fullTicker);
    await sleep(API_DELAY_MS);
  }

  // Fetch highlights if any fundamental trigger uses it
  if (needsSource(config, "highlights")) {
    data.highlights = await eodhd.getFundamentals(fullTicker, "Highlights") as Record<string, unknown>;
    await sleep(API_DELAY_MS);
  }

  // Fetch income statement quarterly
  if (needsSource(config, "income_statement")) {
    data.incomeStatement = await eodhd.getFundamentals(
      fullTicker,
      "Financials::Income_Statement::quarterly",
    ) as Record<string, Record<string, unknown>>;
    await sleep(API_DELAY_MS);
  }

  // Fetch balance sheet quarterly
  if (needsSource(config, "balance_sheet")) {
    data.balanceSheet = await eodhd.getFundamentals(
      fullTicker,
      "Financials::Balance_Sheet::quarterly",
    ) as Record<string, Record<string, unknown>>;
    await sleep(API_DELAY_MS);
  }

  // Fetch cash flow quarterly
  if (needsSource(config, "cash_flow")) {
    data.cashFlow = await eodhd.getFundamentals(
      fullTicker,
      "Financials::Cash_Flow::quarterly",
    ) as Record<string, Record<string, unknown>>;
    await sleep(API_DELAY_MS);
  }

  // Fetch insider transactions
  if (needsInsider(config)) {
    data.insiderTransactions = await eodhd.getInsiderTransactions(fullTicker, { limit: 30 });
    await sleep(API_DELAY_MS);
  }

  return data;
}
