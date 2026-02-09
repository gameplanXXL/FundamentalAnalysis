import { eodhd, type RealTimePrice, type NewsArticle } from "./eodhd-client.js";
import type { StockConfig, FundamentalTrigger, SentimentTrigger } from "./watchlist-schema.js";

const API_DELAY_MS = parseInt(process.env.MONITOR_API_DELAY_MS ?? "200", 10);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export interface AnalystRatings {
  Rating: number;
  TargetPrice: number;
  StrongBuy: number;
  Buy: number;
  Hold: number;
  Sell: number;
  StrongSell: number;
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
  recentNews?: NewsArticle[];
  analystRatings?: AnalystRatings;
}

function needsSource(config: StockConfig, source: string): boolean {
  return config.fundamental_triggers.some((t: FundamentalTrigger) => t.source === source);
}

function needsInsider(config: StockConfig): boolean {
  return config.sentiment_triggers.some(
    (t: SentimentTrigger) => t.metric === "insider_net_sells" || t.metric === "insider_net_buys" || t.metric === "congress_buys",
  );
}

function needsNews(config: StockConfig): boolean {
  return config.sentiment_triggers.some((t: SentimentTrigger) => t.metric === "news_sentiment_avg");
}

function needsAnalystRatings(config: StockConfig): boolean {
  return config.sentiment_triggers.some(
    (t: SentimentTrigger) => t.metric === "analyst_consensus_rating" || t.metric === "analyst_target_vs_price_pct",
  );
}

function needsPrice(config: StockConfig): boolean {
  return config.price_triggers.length > 0
    || config.sentiment_triggers.some((t: SentimentTrigger) => t.metric === "analyst_target_vs_price_pct");
}

export async function fetchStockData(ticker: string, config: StockConfig, exchange: string): Promise<StockData> {
  const fullTicker = `${ticker}.${exchange}`;
  const data: StockData = { ticker, config };

  // Fetch real-time price (needed for price triggers and analyst_target_vs_price_pct)
  if (needsPrice(config)) {
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

  // Fetch news for sentiment analysis
  if (needsNews(config)) {
    data.recentNews = await eodhd.getNews({ ticker: fullTicker, limit: 10 });
    await sleep(API_DELAY_MS);
  }

  // Fetch analyst ratings
  if (needsAnalystRatings(config)) {
    const raw = await eodhd.getFundamentals(fullTicker, "AnalystRatings") as Record<string, unknown> | null;
    if (raw && raw.Rating != null) {
      data.analystRatings = {
        Rating: Number(raw.Rating),
        TargetPrice: Number(raw.TargetPrice ?? 0),
        StrongBuy: Number(raw.StrongBuy ?? 0),
        Buy: Number(raw.Buy ?? 0),
        Hold: Number(raw.Hold ?? 0),
        Sell: Number(raw.Sell ?? 0),
        StrongSell: Number(raw.StrongSell ?? 0),
      };
    }
    await sleep(API_DELAY_MS);
  }

  return data;
}
