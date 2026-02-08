import { z } from "zod";
import { eodhd } from "../lib/eodhd-client.js";

export const getFundamentalsSchema = z.object({
  ticker: z.string().describe("Ticker symbol, e.g. ORCL.US or ORCL (defaults to .US)"),
  section: z
    .enum([
      "all",
      "general",
      "highlights",
      "valuation",
      "shares-stats",
      "technicals",
      "splits-dividends",
      "analyst-ratings",
      "holders",
      "insider-transactions",
      "earnings",
      "balance-sheet-yearly",
      "balance-sheet-quarterly",
      "income-statement-yearly",
      "income-statement-quarterly",
      "cash-flow-yearly",
      "cash-flow-quarterly",
    ])
    .default("highlights")
    .describe("Data section to retrieve. Default: highlights"),
});

const SECTION_TO_FILTER: Record<string, string> = {
  all: "",
  general: "General",
  highlights: "Highlights",
  valuation: "Valuation",
  "shares-stats": "SharesStats",
  technicals: "Technicals",
  "splits-dividends": "SplitsDividends",
  "analyst-ratings": "AnalystRatings",
  holders: "Holders",
  "insider-transactions": "InsiderTransactions",
  earnings: "Earnings",
  "balance-sheet-yearly": "Financials::Balance_Sheet::yearly",
  "balance-sheet-quarterly": "Financials::Balance_Sheet::quarterly",
  "income-statement-yearly": "Financials::Income_Statement::yearly",
  "income-statement-quarterly": "Financials::Income_Statement::quarterly",
  "cash-flow-yearly": "Financials::Cash_Flow::yearly",
  "cash-flow-quarterly": "Financials::Cash_Flow::quarterly",
};

export async function getFundamentals(args: z.infer<typeof getFundamentalsSchema>) {
  const filter = SECTION_TO_FILTER[args.section] || undefined;
  const data = await eodhd.getFundamentals(args.ticker, filter);
  return JSON.stringify(data, null, 2);
}

export const getHighlightsSchema = z.object({
  ticker: z.string().describe("Ticker symbol, e.g. ORCL.US"),
});

export async function getHighlights(args: z.infer<typeof getHighlightsSchema>) {
  const data = await eodhd.getFundamentals(args.ticker, "Highlights");
  return JSON.stringify(data, null, 2);
}

export const getPeersSchema = z.object({
  ticker: z.string().describe("Ticker symbol, e.g. ORCL.US"),
});

export async function getPeers(args: z.infer<typeof getPeersSchema>) {
  const general = (await eodhd.getFundamentals(args.ticker, "General")) as Record<string, unknown>;
  // Peers are typically in General section
  const peers = (general as Record<string, unknown>)?.["Peers"] ?? "No peer data available";
  return JSON.stringify(peers, null, 2);
}
