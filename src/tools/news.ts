import { z } from "zod";
import { eodhd } from "../lib/eodhd-client.js";

export const getFinancialNewsSchema = z.object({
  ticker: z.string().optional().describe("Ticker symbol, e.g. ORCL.US"),
  tag: z.string().optional().describe("News topic tag, e.g. technology, earnings"),
  from: z.string().optional().describe("Start date YYYY-MM-DD"),
  to: z.string().optional().describe("End date YYYY-MM-DD"),
  limit: z.number().min(1).max(100).default(10).describe("Number of articles (default: 10, max: 100)"),
  offset: z.number().optional().describe("Pagination offset"),
});

export async function getFinancialNews(args: z.infer<typeof getFinancialNewsSchema>) {
  if (!args.ticker && !args.tag) {
    return JSON.stringify({ error: "Either 'ticker' or 'tag' must be provided" });
  }
  const data = await eodhd.getNews({
    ticker: args.ticker,
    tag: args.tag,
    from: args.from,
    to: args.to,
    limit: args.limit,
    offset: args.offset,
  });
  return JSON.stringify(data, null, 2);
}
