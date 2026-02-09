import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

import { loadWatchlist } from "./lib/watchlist-loader.js";
import { fetchStockData } from "./lib/data-fetcher.js";
import { evaluateTriggers, evaluateMarketTriggers, type MarketContext } from "./lib/trigger-evaluator.js";
import { fetchCryptoData } from "./lib/crypto-data-fetcher.js";
import { evaluateCryptoTriggers } from "./lib/crypto-trigger-evaluator.js";
import { notify, type MonitorResult } from "./lib/notifications.js";
import { fetchFearGreedIndex } from "./lib/fear-greed-client.js";
import { eodhd } from "./lib/eodhd-client.js";

async function main(): Promise<void> {
  console.log("Lade Watchlist...");
  const watchlist = loadWatchlist();
  const exchange = watchlist.defaults.exchange;
  const cryptoExchange = watchlist.defaults.crypto_exchange;

  const results: MonitorResult[] = [];
  let totalFired = 0;

  // --- Market Context (Fear & Greed + VIX) ---
  const marketContext: MarketContext = {};
  try {
    console.log("Lade Markt-Kontext (Fear & Greed, VIX)...");
    const [fearGreed, vixPrice] = await Promise.all([
      fetchFearGreedIndex(),
      eodhd.getRealTimePrice("VIX.INDX").catch(() => null),
    ]);
    if (fearGreed) {
      marketContext.fearGreedIndex = fearGreed.value;
      marketContext.fearGreedClassification = fearGreed.classification;
      console.log(`  Fear & Greed: ${fearGreed.value}/100 (${fearGreed.classification})`);
    }
    if (vixPrice) {
      marketContext.vixLevel = vixPrice.close;
      console.log(`  VIX: ${vixPrice.close.toFixed(2)}`);
    }
  } catch (err) {
    console.error("Markt-Kontext konnte nicht geladen werden:", err);
  }

  // --- Market-Level Triggers ---
  const marketTriggers = watchlist.market_triggers ?? [];
  if (marketTriggers.length > 0) {
    const marketAlerts = evaluateMarketTriggers(marketTriggers, marketContext);
    const firedCount = marketAlerts.filter((a) => a.fired).length;
    totalFired += firedCount;
    results.push({
      ticker: "MARKET",
      name: "Markt-Indikatoren",
      status: "WATCH",
      alerts: marketAlerts,
    });
  }

  // --- Stocks ---
  const tickers = Object.keys(watchlist.stocks);
  console.log(`${tickers.length} Aktie(n) in Watchlist: ${tickers.join(", ")}\n`);

  for (const ticker of tickers) {
    const stockConfig = watchlist.stocks[ticker];
    console.log(`Pruefe ${ticker} (${stockConfig.name})...`);

    try {
      const data = await fetchStockData(ticker, stockConfig, exchange);
      const alerts = evaluateTriggers(data, marketContext);
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

  // --- Cryptos ---
  const cryptoTickers = Object.keys(watchlist.cryptos ?? {});
  if (cryptoTickers.length > 0) {
    console.log(`\n${cryptoTickers.length} Crypto(s) in Watchlist: ${cryptoTickers.join(", ")}\n`);

    for (const ticker of cryptoTickers) {
      const cryptoConfig = watchlist.cryptos[ticker];
      console.log(`Pruefe ${ticker} (${cryptoConfig.name})...`);

      try {
        const data = await fetchCryptoData(ticker, cryptoConfig, cryptoExchange);
        const alerts = evaluateCryptoTriggers(data);
        const firedCount = alerts.filter((a) => a.fired).length;
        totalFired += firedCount;

        results.push({
          ticker,
          name: cryptoConfig.name,
          status: cryptoConfig.status,
          price: data.realTimePrice?.close,
          alerts,
        });
      } catch (err) {
        console.error(`Fehler bei ${ticker}:`, err);
        results.push({
          ticker,
          name: cryptoConfig.name,
          status: cryptoConfig.status,
          alerts: [],
        });
      }
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
