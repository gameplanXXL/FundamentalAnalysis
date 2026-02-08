import { z } from "zod";
import { eodhd } from "../lib/eodhd-client.js";

export const getEodPriceSchema = z.object({
  ticker: z.string().describe("Ticker symbol, e.g. ORCL.US"),
  from: z.string().optional().describe("Start date YYYY-MM-DD"),
  to: z.string().optional().describe("End date YYYY-MM-DD"),
  period: z
    .enum(["d", "w", "m"])
    .default("d")
    .describe("Period: d=daily, w=weekly, m=monthly"),
  order: z
    .enum(["a", "d"])
    .default("d")
    .describe("Sort order: a=ascending, d=descending"),
});

export async function getEodPrice(args: z.infer<typeof getEodPriceSchema>) {
  const data = await eodhd.getEodPrice(args.ticker, {
    from: args.from,
    to: args.to,
    period: args.period,
    order: args.order,
  });
  return JSON.stringify(data, null, 2);
}

export const getRealTimePriceSchema = z.object({
  ticker: z.string().describe("Ticker symbol, e.g. ORCL.US"),
});

export async function getRealTimePrice(args: z.infer<typeof getRealTimePriceSchema>) {
  const data = await eodhd.getRealTimePrice(args.ticker);
  return JSON.stringify(data, null, 2);
}

export const getDividendsSchema = z.object({
  ticker: z.string().describe("Ticker symbol, e.g. ORCL.US"),
  from: z.string().optional().describe("Start date YYYY-MM-DD"),
  to: z.string().optional().describe("End date YYYY-MM-DD"),
});

export async function getDividends(args: z.infer<typeof getDividendsSchema>) {
  const data = await eodhd.getDividends(args.ticker, {
    from: args.from,
    to: args.to,
  });
  return JSON.stringify(data, null, 2);
}
