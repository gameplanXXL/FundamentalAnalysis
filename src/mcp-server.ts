#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { getFundamentals, getFundamentalsSchema, getHighlights, getHighlightsSchema, getPeers, getPeersSchema } from "./tools/fundamentals.js";
import { getEodPrice, getEodPriceSchema, getRealTimePrice, getRealTimePriceSchema, getDividends, getDividendsSchema } from "./tools/price.js";
import { getFinancialNews, getFinancialNewsSchema } from "./tools/news.js";
import { searchStock, searchStockSchema, getInsiderTransactions, getInsiderTransactionsSchema } from "./tools/search.js";
import { getCryptoMarket, getCryptoMarketSchema, getCryptoDetail, getCryptoDetailSchema, getCryptoGlobal, getCryptoGlobalSchema } from "./tools/crypto.js";

const server = new McpServer({
  name: "eodhd",
  version: "1.0.0",
});

// Core tools
server.registerTool(
  "get-fundamentals",
  {
    description: "Get fundamental financial data for a stock (balance sheet, income statement, cash flow, highlights, etc.). Use 'section' to filter specific data.",
    inputSchema: getFundamentalsSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getFundamentals(getFundamentalsSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-eod-price",
  {
    description: "Get historical end-of-day OHLCV price data for a stock.",
    inputSchema: getEodPriceSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getEodPrice(getEodPriceSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-real-time-price",
  {
    description: "Get current real-time OHLCV price snapshot for a stock (15-20 min delay).",
    inputSchema: getRealTimePriceSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getRealTimePrice(getRealTimePriceSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-financial-news",
  {
    description: "Get financial news articles. Filter by ticker and/or topic tag. At least one of ticker or tag is required.",
    inputSchema: getFinancialNewsSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getFinancialNews(getFinancialNewsSchema.parse(args)) }],
  }),
);

server.registerTool(
  "search-stock",
  {
    description: "Search for stocks, ETFs, funds by name, ticker, or ISIN.",
    inputSchema: searchStockSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await searchStock(searchStockSchema.parse(args)) }],
  }),
);

// Optional tools
server.registerTool(
  "get-dividends",
  {
    description: "Get dividend history for a stock.",
    inputSchema: getDividendsSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getDividends(getDividendsSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-insider-transactions",
  {
    description: "Get insider buying/selling transactions for a stock.",
    inputSchema: getInsiderTransactionsSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getInsiderTransactions(getInsiderTransactionsSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-highlights",
  {
    description: "Get key financial highlights (market cap, P/E, EPS, dividend yield, etc.) for a stock.",
    inputSchema: getHighlightsSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getHighlights(getHighlightsSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-peers",
  {
    description: "Get peer/comparable companies for a stock.",
    inputSchema: getPeersSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getPeers(getPeersSchema.parse(args)) }],
  }),
);

// CoinGecko tools
server.registerTool(
  "get-crypto-market",
  {
    description: "Get market data for multiple cryptocurrencies (price, market cap, volume, 24h/7d/30d changes). Data from CoinGecko.",
    inputSchema: getCryptoMarketSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getCryptoMarket(getCryptoMarketSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-crypto-detail",
  {
    description: "Get detailed crypto data including community stats (Reddit, Twitter), developer activity (GitHub commits, stars), and market data. Data from CoinGecko.",
    inputSchema: getCryptoDetailSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getCryptoDetail(getCryptoDetailSchema.parse(args)) }],
  }),
);

server.registerTool(
  "get-crypto-global",
  {
    description: "Get global crypto market stats (total market cap, dominance, volume) and top-7 trending coins. Data from CoinGecko.",
    inputSchema: getCryptoGlobalSchema.shape,
  },
  async (args) => ({
    content: [{ type: "text" as const, text: await getCryptoGlobal() }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("EODHD MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
