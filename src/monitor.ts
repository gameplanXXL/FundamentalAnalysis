import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

import { loadWatchlist } from "./lib/watchlist-loader.js";
import { fetchStockData } from "./lib/data-fetcher.js";
import { evaluateTriggers } from "./lib/trigger-evaluator.js";
import { notify, type MonitorResult } from "./lib/notifications.js";

async function main(): Promise<void> {
  console.log("Lade Watchlist...");
  const watchlist = loadWatchlist();
  const exchange = watchlist.defaults.exchange;
  const tickers = Object.keys(watchlist.stocks);
  console.log(`${tickers.length} Aktie(n) in Watchlist: ${tickers.join(", ")}\n`);

  const results: MonitorResult[] = [];
  let totalFired = 0;

  for (const ticker of tickers) {
    const stockConfig = watchlist.stocks[ticker];
    console.log(`Pruefe ${ticker} (${stockConfig.name})...`);

    try {
      const data = await fetchStockData(ticker, stockConfig, exchange);
      const alerts = evaluateTriggers(data);
      const firedCount = alerts.filter((a) => a.fired).length;
      totalFired += firedCount;

      results.push({
        ticker,
        name: stockConfig.name,
        status: stockConfig.status,
        price: data.realTimePrice?.close,
        alerts,
      });
    } catch (err) {
      console.error(`Fehler bei ${ticker}:`, err);
      results.push({
        ticker,
        name: stockConfig.name,
        status: stockConfig.status,
        alerts: [],
      });
    }
  }

  await notify(results);

  // Exit 0 on normal run (even with fired alerts) so cron doesn't report errors
  process.exit(0);
}

main().catch((err) => {
  console.error("Monitor fehlgeschlagen:", err);
  process.exit(2);
});
