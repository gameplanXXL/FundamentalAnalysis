import { eodhd, type RealTimePrice, type NewsArticle } from "./eodhd-client.js";
import type { CryptoConfig } from "./watchlist-schema.js";

const API_DELAY_MS = parseInt(process.env.MONITOR_API_DELAY_MS ?? "200", 10);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export interface CryptoStatistics {
  MarketCapitalization: number;
  CirculatingSupply: number;
  TotalSupply: number;
  MaxSupply: number;
  MarketCapDominance: number;
  LowAllTime: number;
  HighAllTime: number;
}

export interface CryptoData {
  ticker: string;
  config: CryptoConfig;
  realTimePrice?: RealTimePrice;
  statistics?: CryptoStatistics;
  recentNews?: NewsArticle[];
}

export async function fetchCryptoData(
  ticker: string,
  config: CryptoConfig,
  cryptoExchange: string,
): Promise<CryptoData> {
  const fullTicker = `${ticker}.${cryptoExchange}`;
  const data: CryptoData = { ticker, config };

  // Always fetch real-time price
  if (config.price_triggers.length > 0 || config.crypto_triggers.length > 0) {
    data.realTimePrice = await eodhd.getRealTimePrice(fullTicker);
    await sleep(API_DELAY_MS);
  }

  // Fetch statistics if any crypto trigger needs them
  if (config.crypto_triggers.length > 0) {
    const raw = await eodhd.getFundamentals(fullTicker, "Statistics") as Record<string, unknown> | null;
    if (raw) {
      data.statistics = {
        MarketCapitalization: Number(raw.MarketCapitalization ?? 0),
        CirculatingSupply: Number(raw.CirculatingSupply ?? 0),
        TotalSupply: Number(raw.TotalSupply ?? 0),
        MaxSupply: Number(raw.MaxSupply ?? 0),
        MarketCapDominance: Number(raw.MarketCapDominance ?? 0),
        LowAllTime: Number(raw.LowAllTime ?? 0),
        HighAllTime: Number(raw.HighAllTime ?? 0),
      };
    }
    await sleep(API_DELAY_MS);
  }

  // Fetch news if sentiment trigger is configured
  const needsNews = config.crypto_triggers.some((t) => t.metric === "news_sentiment_avg");
  if (needsNews) {
    data.recentNews = await eodhd.getNews({ ticker: fullTicker, limit: 10 });
    await sleep(API_DELAY_MS);
  }

  return data;
}
