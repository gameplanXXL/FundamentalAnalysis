import type { CryptoData } from "./crypto-data-fetcher.js";
import type { PriceTrigger, CryptoTrigger } from "./watchlist-schema.js";
import { compare, severityForAction, type Alert } from "./trigger-utils.js";

function evaluatePriceTriggers(data: CryptoData, triggers: PriceTrigger[]): Alert[] {
  const alerts: Alert[] = [];
  const price = data.realTimePrice?.close;
  if (price == null) return alerts;

  for (const trigger of triggers) {
    const fired = compare(price, trigger.operator, trigger.value);
    alerts.push({
      ticker: data.ticker,
      metric: `price (${trigger.operator} ${trigger.value})`,
      label: trigger.label,
      action: trigger.action,
      currentValue: price,
      threshold: trigger.value,
      fired,
      severity: severityForAction(trigger.action),
    });
  }
  return alerts;
}

function computeCryptoMetric(data: CryptoData, metric: string): number | null {
  const stats = data.statistics;
  const price = data.realTimePrice?.close;

  switch (metric) {
    case "market_cap":
      return stats?.MarketCapitalization ?? null;

    case "market_cap_dominance":
      return stats?.MarketCapDominance ?? null;

    case "volume_24h":
      return data.realTimePrice?.volume ?? null;

    case "volume_market_cap_ratio": {
      const vol = data.realTimePrice?.volume;
      const mcap = stats?.MarketCapitalization;
      if (vol == null || mcap == null || mcap === 0) return null;
      return vol / mcap;
    }

    case "circulating_supply_ratio": {
      const circulating = stats?.CirculatingSupply;
      const max = stats?.MaxSupply;
      if (circulating == null || max == null || max === 0) return null;
      return circulating / max;
    }

    case "distance_from_ath_pct": {
      const ath = stats?.HighAllTime;
      if (ath == null || ath === 0 || price == null) return null;
      return ((ath - price) / ath) * 100;
    }

    case "distance_from_atl_pct": {
      const atl = stats?.LowAllTime;
      if (atl == null || atl === 0 || price == null) return null;
      return ((price - atl) / atl) * 100;
    }

    case "news_sentiment_avg": {
      const news = data.recentNews;
      if (!news || news.length === 0) return null;
      const totalPolarity = news.reduce((sum, article) => sum + (article.sentiment?.polarity ?? 0), 0);
      return totalPolarity / news.length;
    }

    default:
      return null;
  }
}

function evaluateCryptoMetricTriggers(data: CryptoData, triggers: CryptoTrigger[]): Alert[] {
  const alerts: Alert[] = [];

  for (const trigger of triggers) {
    const value = computeCryptoMetric(data, trigger.metric);
    if (value == null) continue;

    const fired = compare(value, trigger.operator, trigger.value);
    alerts.push({
      ticker: data.ticker,
      metric: trigger.metric,
      label: trigger.label,
      action: trigger.action,
      currentValue: value,
      threshold: trigger.value,
      fired,
      severity: severityForAction(trigger.action),
    });
  }

  return alerts;
}

export function evaluateCryptoTriggers(data: CryptoData): Alert[] {
  const config = data.config;
  return [
    ...evaluatePriceTriggers(data, config.price_triggers),
    ...evaluateCryptoMetricTriggers(data, config.crypto_triggers),
  ];
}
