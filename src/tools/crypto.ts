import { z } from "zod";
import { coingecko } from "../lib/coingecko-client.js";

// --- get-crypto-market ---

export const getCryptoMarketSchema = z.object({
  vs_currency: z
    .string()
    .default("usd")
    .describe("Target currency (e.g. usd, eur, btc). Default: usd"),
  ids: z
    .string()
    .optional()
    .describe("Comma-separated CoinGecko IDs (e.g. bitcoin,ethereum,solana)"),
  per_page: z
    .number()
    .int()
    .min(1)
    .max(250)
    .default(20)
    .describe("Results per page (1-250). Default: 20"),
  order: z
    .enum(["market_cap_desc", "market_cap_asc", "volume_desc", "volume_asc"])
    .default("market_cap_desc")
    .describe("Sort order. Default: market_cap_desc"),
});

export async function getCryptoMarket(args: z.infer<typeof getCryptoMarketSchema>) {
  const data = await coingecko.getMarkets({
    vs_currency: args.vs_currency,
    ids: args.ids,
    per_page: args.per_page,
    order: args.order,
  });
  if (data == null) return "CoinGecko API key not configured.";
  return JSON.stringify(data, null, 2);
}

// --- get-crypto-detail ---

export const getCryptoDetailSchema = z.object({
  id: z.string().describe("CoinGecko coin ID (e.g. bitcoin, ethereum, solana)"),
});

export async function getCryptoDetail(args: z.infer<typeof getCryptoDetailSchema>) {
  const data = await coingecko.getCoinDetail(args.id);
  if (data == null) return "CoinGecko API key not configured.";
  return JSON.stringify(data, null, 2);
}

// --- get-crypto-global ---

export const getCryptoGlobalSchema = z.object({});

export async function getCryptoGlobal() {
  const [globalData, trending] = await Promise.all([
    coingecko.getGlobal(),
    coingecko.getTrending(),
  ]);
  if (globalData == null) return "CoinGecko API key not configured.";
  const result = {
    global: globalData,
    trending: trending?.coins ?? [],
  };
  return JSON.stringify(result, null, 2);
}
