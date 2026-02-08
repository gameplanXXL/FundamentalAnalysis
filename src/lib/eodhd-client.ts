import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

const BASE_URL = "https://eodhd.com/api";
const API_TOKEN = process.env.EODHD_API_TOKEN ?? process.env.EODHD_API_KEY ?? "";

if (!API_TOKEN) {
  console.error("EODHD API token not found. Set EODHD_API_TOKEN or EODHD_API_KEY in .env");
}

interface RequestParams {
  [key: string]: string | number | undefined;
}

async function request<T>(endpoint: string, params: RequestParams = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set("fmt", "json");

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`EODHD API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export interface EodPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface RealTimePrice {
  code: string;
  timestamp: number;
  gmtoffset: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previousClose: number;
  change: number;
  change_p: number;
}

export interface NewsArticle {
  date: string;
  title: string;
  content: string;
  link: string;
  symbols: string[];
  tags: string[];
  sentiment: {
    polarity: number;
    neg: number;
    neu: number;
    pos: number;
  };
}

export interface SearchResult {
  Code: string;
  Exchange: string;
  Name: string;
  Type: string;
  Country: string;
  Currency: string;
  ISIN: string;
  previousClose: number;
  previousCloseDate: string;
}

export interface Dividend {
  date: string;
  declarationDate: string;
  recordDate: string;
  paymentDate: string;
  value: number;
  unadjustedValue: number;
  currency: string;
}

function normalizeTicker(ticker: string): string {
  return ticker.includes(".") ? ticker : `${ticker}.US`;
}

export const eodhd = {
  async getFundamentals(ticker: string, filter?: string): Promise<unknown> {
    const t = normalizeTicker(ticker);
    const params: RequestParams = {};
    if (filter) {
      params.filter = filter;
    }
    return request<unknown>(`/fundamentals/${t}`, params);
  },

  async getEodPrice(
    ticker: string,
    opts?: { from?: string; to?: string; period?: string; order?: string },
  ): Promise<EodPrice[]> {
    const t = normalizeTicker(ticker);
    return request<EodPrice[]>(`/eod/${t}`, opts);
  },

  async getRealTimePrice(ticker: string): Promise<RealTimePrice> {
    const t = normalizeTicker(ticker);
    return request<RealTimePrice>(`/real-time/${t}`);
  },

  async getNews(opts: {
    ticker?: string;
    tag?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }): Promise<NewsArticle[]> {
    const params: RequestParams = {};
    if (opts.ticker) params.s = normalizeTicker(opts.ticker);
    if (opts.tag) params.t = opts.tag;
    if (opts.from) params.from = opts.from;
    if (opts.to) params.to = opts.to;
    if (opts.limit) params.limit = opts.limit;
    if (opts.offset) params.offset = opts.offset;
    return request<NewsArticle[]>("/news", params);
  },

  async search(query: string, opts?: {
    exchange?: string;
    type?: string;
    limit?: number;
  }): Promise<SearchResult[]> {
    return request<SearchResult[]>(`/search/${encodeURIComponent(query)}`, opts);
  },

  async getDividends(ticker: string, opts?: {
    from?: string;
    to?: string;
  }): Promise<Dividend[]> {
    const t = normalizeTicker(ticker);
    return request<Dividend[]>(`/div/${t}`, opts);
  },

  async getInsiderTransactions(ticker: string, opts?: {
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const params: RequestParams = { code: normalizeTicker(ticker), ...opts };
    return request<unknown[]>("/insider-transactions", params);
  },
};
