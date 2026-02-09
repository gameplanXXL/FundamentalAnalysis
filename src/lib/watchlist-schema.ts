import { z } from "zod";

const operatorEnum = z.enum(["<", ">", "<=", ">=", "=="]);

const actionEnum = z.enum(["BUY", "BUY_MORE", "SELL", "HOLD", "REVIEW", "WATCH"]);

const metricEnum = z.enum([
  "operating_margin",
  "fcf",
  "net_debt",
  "revenue_growth_yoy",
  "earnings_growth_yoy",
  "pe_ratio",
  "dividend_yield",
  "current_ratio",
  "debt_equity",
  "insider_net_sells",
  "congress_buys",
]);

const sourceEnum = z.enum([
  "income_statement",
  "balance_sheet",
  "cash_flow",
  "highlights",
]);

export const priceTriggerSchema = z.object({
  operator: operatorEnum,
  value: z.number(),
  action: actionEnum,
  label: z.string(),
});

export const fundamentalTriggerSchema = z.object({
  metric: metricEnum,
  source: sourceEnum,
  operator: operatorEnum,
  value: z.number(),
  quarters: z.number().int().min(1).optional(),
  action: actionEnum,
  label: z.string(),
});

export const sentimentTriggerSchema = z.object({
  metric: z.enum(["insider_net_sells", "congress_buys"]),
  operator: operatorEnum,
  value: z.number(),
  action: actionEnum,
  label: z.string(),
});

export const stockConfigSchema = z.object({
  name: z.string(),
  status: z.enum(["BUY", "HOLD", "SELL", "WATCH"]),
  added: z.string(),
  price_triggers: z.array(priceTriggerSchema).optional().default([]),
  fundamental_triggers: z.array(fundamentalTriggerSchema).optional().default([]),
  sentiment_triggers: z.array(sentimentTriggerSchema).optional().default([]),
});

// --- Crypto Schemas ---

const cryptoMetricEnum = z.enum([
  "market_cap",
  "market_cap_dominance",
  "volume_24h",
  "volume_market_cap_ratio",
  "circulating_supply_ratio",
  "distance_from_ath_pct",
  "distance_from_atl_pct",
  "news_sentiment_avg",
]);

export const cryptoTriggerSchema = z.object({
  metric: cryptoMetricEnum,
  operator: operatorEnum,
  value: z.number(),
  action: actionEnum,
  label: z.string(),
});

const cryptoCategoryEnum = z.enum([
  "L1",
  "L2",
  "DeFi",
  "Stablecoin",
  "Meme",
  "Infrastructure",
  "Gaming",
  "AI",
]);

export const cryptoConfigSchema = z.object({
  name: z.string(),
  status: z.enum(["BUY", "HOLD", "SELL", "WATCH"]),
  added: z.string().optional().default("2026-02-09"),
  category: cryptoCategoryEnum,
  price_triggers: z.array(priceTriggerSchema).optional().default([]),
  crypto_triggers: z.array(cryptoTriggerSchema).optional().default([]),
});

// --- Watchlist Schema ---

export const watchlistSchema = z.object({
  version: z.number(),
  defaults: z.object({
    exchange: z.string().default("US"),
    check_interval: z.string().default("daily"),
    crypto_exchange: z.string().default("CC"),
  }),
  stocks: z.record(z.string(), stockConfigSchema),
  cryptos: z.record(z.string(), cryptoConfigSchema).optional().default({}),
});

// --- Type Exports ---

export type Operator = z.infer<typeof operatorEnum>;
export type Action = z.infer<typeof actionEnum>;
export type Metric = z.infer<typeof metricEnum>;
export type Source = z.infer<typeof sourceEnum>;
export type PriceTrigger = z.infer<typeof priceTriggerSchema>;
export type FundamentalTrigger = z.infer<typeof fundamentalTriggerSchema>;
export type SentimentTrigger = z.infer<typeof sentimentTriggerSchema>;
export type StockConfig = z.infer<typeof stockConfigSchema>;
export type CryptoMetric = z.infer<typeof cryptoMetricEnum>;
export type CryptoTrigger = z.infer<typeof cryptoTriggerSchema>;
export type CryptoCategory = z.infer<typeof cryptoCategoryEnum>;
export type CryptoConfig = z.infer<typeof cryptoConfigSchema>;
export type Watchlist = z.infer<typeof watchlistSchema>;
