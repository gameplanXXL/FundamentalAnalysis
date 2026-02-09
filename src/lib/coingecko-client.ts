import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY ?? "";

if (!API_KEY) {
  console.warn("CoinGecko API key not found. Set COINGECKO_API_KEY in .env — CoinGecko features disabled.");
}

interface RequestParams {
  [key: string]: string | number | undefined;
}

async function request<T>(endpoint: string, params: RequestParams = {}): Promise<T | null> {
  if (!API_KEY) return null;

  const url = new URL(`${BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    headers: { "x-cg-demo-api-key": API_KEY },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`CoinGecko API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

// --- Typed Interfaces ---

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  last_updated: string;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    fully_diluted_valuation: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  community_data: {
    reddit_subscribers: number | null;
    reddit_accounts_active_48h: number | null;
    twitter_followers: number | null;
  };
  developer_data: {
    forks: number | null;
    stars: number | null;
    subscribers: number | null;
    total_issues: number | null;
    closed_issues: number | null;
    pull_requests_merged: number | null;
    pull_request_contributors: number | null;
    commit_count_4_weeks: number | null;
  };
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    score: number;
    data?: {
      price: number;
      market_cap: string;
      total_volume: string;
      price_change_percentage_24h: Record<string, number>;
    };
  };
}

export interface TrendingResponse {
  coins: TrendingCoin[];
}

// --- Ticker Mapping ---

const TICKER_TO_COINGECKO_ID: Record<string, string> = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
  "SOL-USD": "solana",
  "DOGE-USD": "dogecoin",
  "XRP-USD": "ripple",
  "ADA-USD": "cardano",
  "DOT-USD": "polkadot",
  "AVAX-USD": "avalanche-2",
  "MATIC-USD": "matic-network",
  "LINK-USD": "chainlink",
  "UNI-USD": "uniswap",
  "ATOM-USD": "cosmos",
  "LTC-USD": "litecoin",
  "NEAR-USD": "near",
  "ARB-USD": "arbitrum",
  "OP-USD": "optimism",
};

export function tickerToCoinGeckoId(ticker: string): string | null {
  return TICKER_TO_COINGECKO_ID[ticker] ?? null;
}

export function isAvailable(): boolean {
  return !!API_KEY;
}

// --- Client Methods ---

export const coingecko = {
  async getMarkets(opts?: {
    vs_currency?: string;
    ids?: string;
    per_page?: number;
    order?: string;
  }): Promise<CoinMarket[] | null> {
    return request<CoinMarket[]>("/coins/markets", {
      vs_currency: opts?.vs_currency ?? "usd",
      ids: opts?.ids,
      per_page: opts?.per_page ?? 100,
      order: opts?.order ?? "market_cap_desc",
      sparkline: "false",
      price_change_percentage: "7d,30d",
    });
  },

  async getCoinDetail(id: string): Promise<CoinDetail | null> {
    return request<CoinDetail>(`/coins/${id}`, {
      localization: "false",
      tickers: "false",
      market_data: "true",
      community_data: "true",
      developer_data: "true",
      sparkline: "false",
    });
  },

  async getGlobal(): Promise<GlobalData | null> {
    return request<GlobalData>("/global");
  },

  async getTrending(): Promise<TrendingResponse | null> {
    return request<TrendingResponse>("/search/trending");
  },
};
