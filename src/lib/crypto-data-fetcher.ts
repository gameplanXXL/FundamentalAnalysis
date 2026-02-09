import { eodhd, type RealTimePrice, type NewsArticle } from "./eodhd-client.js";
import type { CryptoConfig } from "./watchlist-schema.js";
import { coingecko, tickerToCoinGeckoId, isAvailable as isCoinGeckoAvailable } from "./coingecko-client.js";

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

export interface CoinGeckoEnrichedData {
  developer_data: {
    commit_count_4_weeks: number | null;
    stars: number | null;
  };
  community_data: {
    reddit_subscribers: number | null;
  };
  market_data: {
    fully_diluted_valuation: number;
    market_cap: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
}

export interface CryptoData {
  ticker: string;
  config: CryptoConfig;
  realTimePrice?: RealTimePrice;
  statistics?: CryptoStatistics;
  recentNews?: NewsArticle[];
  coingecko?: CoinGeckoEnrichedData;
}

const COINGECKO_METRICS = new Set([
  "developer_commit_count_4w",
  "developer_stars",
  "community_reddit_subscribers",
  "fdv_mcap_ratio",
  "price_change_pct_7d",
  "price_change_pct_30d",
]);

function needsCoinGecko(config: CryptoConfig): boolean {
  return config.crypto_triggers.some((t) => COINGECKO_METRICS.has(t.metric));
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

  // Fetch CoinGecko data if needed and available
  if (isCoinGeckoAvailable() && needsCoinGecko(config)) {
    const coinId = tickerToCoinGeckoId(ticker);
    if (coinId) {
      const detail = await coingecko.getCoinDetail(coinId);
      if (detail) {
        data.coingecko = {
          developer_data: {
            commit_count_4_weeks: detail.developer_data?.commit_count_4_weeks ?? null,
            stars: detail.developer_data?.stars ?? null,
          },
          community_data: {
            reddit_subscribers: detail.community_data?.reddit_subscribers ?? null,
          },
          market_data: {
            fully_diluted_valuation: detail.market_data?.fully_diluted_valuation?.usd ?? 0,
            market_cap: detail.market_data?.market_cap?.usd ?? 0,
            price_change_percentage_7d: detail.market_data?.price_change_percentage_7d ?? 0,
            price_change_percentage_30d: detail.market_data?.price_change_percentage_30d ?? 0,
          },
        };
      }
      await sleep(API_DELAY_MS);
    }
  }

  return data;
}
