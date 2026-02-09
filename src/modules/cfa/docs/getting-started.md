# Getting Started mit CFA

## Voraussetzungen

1. **EODHD API Key** in `.env` als `EODHD_API_TOKEN` oder `EODHD_API_KEY`
2. **EODHD MCP Server** laeuft (`make start` oder `make dev`)
3. **Claude Code** mit MCP-Unterstuetzung

## Schnellstart

### 1. Modul installieren

```bash
bmad install cfa
```

### 2. Crypto-Analyst starten

```
/cfa-analyst
```

Du wirst von **Satoshi** begruesst, dem Crypto-Analysten.

### 3. Erste Analyse

Sage einfach:

> "Analysiere Bitcoin fuer mich"

Satoshi wird:
1. Marktdaten von EODHD holen (Kurs, MarketCap, Supply)
2. Tokenomics analysieren
3. News-Sentiment auswerten
4. Einen ausfuehrlichen Report erstellen

### 4. Watchlist-Monitor

Crypto-Assets koennen auch im automatischen Monitor ueberwacht werden:

```bash
npm run monitor-dev
```

Die `config/watchlist.yaml` enthaelt bereits 5 Crypto-Assets mit Preis- und Crypto-Triggern.

## EODHD Crypto-Daten

EODHD unterstuetzt Crypto ueber die **CC-Exchange**:

- Ticker-Format: `BTC-USD.CC`, `ETH-USD.CC`, `SOL-USD.CC`
- Verfuegbare Daten: Preis, MarketCap, Supply, ATH/ATL, Dominance, News mit Sentiment
- Kosten: Im bestehenden EODHD-Plan enthalten (keine zusaetzlichen Kosten)

## Naechste Schritte

- [Agents Reference](agents.md) — Satoshi und Cassandra kennenlernen
- [Workflows Reference](workflows.md) — Alle verfuegbaren Workflows
