import { z } from "zod";
import { eodhd } from "../lib/eodhd-client.js";

export const searchStockSchema = z.object({
  query: z.string().describe("Search query (company name, ticker, or ISIN)"),
  exchange: z.string().optional().describe("Filter by exchange code, e.g. US, XETRA"),
  type: z
    .enum(["stock", "etf", "fund", "bond", "index", "crypto", "all"])
    .optional()
    .describe("Asset type filter"),
  limit: z.number().min(1).max(50).default(15).describe("Max results (default: 15)"),
});

export async function searchStock(args: z.infer<typeof searchStockSchema>) {
  const data = await eodhd.search(args.query, {
    exchange: args.exchange,
    type: args.type,
    limit: args.limit,
  });
  return JSON.stringify(data, null, 2);
}

export const getInsiderTransactionsSchema = z.object({
  ticker: z.string().describe("Ticker symbol, e.g. ORCL.US"),
  from: z.string().optional().describe("Start date YYYY-MM-DD"),
  to: z.string().optional().describe("End date YYYY-MM-DD"),
  limit: z.number().min(1).max(100).default(20).describe("Max results (default: 20)"),
});

export async function getInsiderTransactions(args: z.infer<typeof getInsiderTransactionsSchema>) {
  const data = await eodhd.getInsiderTransactions(args.ticker, {
    from: args.from,
    to: args.to,
    limit: args.limit,
  });
  return JSON.stringify(data, null, 2);
}
