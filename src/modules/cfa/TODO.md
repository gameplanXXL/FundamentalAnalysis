# TODO: CFA: Crypto Fundamental Analysis

Development roadmap for cfa module.

---

## Phase 1: Monitor-Integration (DONE)

- [x] Watchlist-Schema um Crypto-Schemas erweitern
- [x] Crypto-Data-Fetcher erstellen (EODHD CC-Exchange)
- [x] Crypto-Trigger-Evaluator erstellen
- [x] Monitor um Crypto-Schleife erweitern
- [x] Notifications fuer Crypto-Metriken anpassen
- [x] Watchlist mit 5 Crypto-Assets (BTC, ETH, SOL, DOGE, XRP)

---

## Phase 2: BMAD-Modul (DONE)

### Agents

- [x] **Satoshi** (Crypto-Analyst)
  - Spec: `agents/analyst.spec.md`

- [x] **Cassandra** (Crypto-Risiko-Managerin)
  - Spec: `agents/risk-manager.spec.md`

### Workflows

- [x] **analyze-crypto** — Vollstaendige Crypto-Analyse
- [x] **crypto-decision** — BUY/HOLD/SELL Empfehlung
- [x] **compare-cryptos** — Vergleich mehrerer Assets
- [x] **market-overview** — Globale Markt-Uebersicht
- [x] **token-economics** — Tokenomics Deep-Dive
- [x] **fetch-crypto-data** — Interner Daten-Fetcher
- [x] **explain-metric** — Crypto-Metrik erklaeren

---

## Phase 3: CoinGecko-Integration (PLANNED)

- [ ] `src/lib/coingecko-client.ts` — API-Client (Free Tier: 10k Calls/Monat)
- [ ] `src/tools/crypto.ts` — Neue MCP-Tools: `get-crypto-market`, `get-crypto-detail`, `get-crypto-global`
- [ ] Erweiterte Metriken: Community-Daten, Developer-Aktivitaet, Trending-Coins
- [ ] CoinGecko API Key in .env als `COINGECKO_API_KEY` (bereits vorhanden)

---

## Testing

- [ ] Build: `npm run build` — keine TypeScript-Fehler
- [ ] Monitor mit nur Stocks: bestehende Funktionalitaet unveraendert
- [ ] Monitor mit Crypto: BTC-USD und ETH-USD werden ausgewertet
- [ ] MCP-Tools: `search-stock` mit type crypto, `get-real-time-price` mit BTC-USD.CC
- [ ] CFA-Agent: `analyze-crypto` Workflow fuer BTC testen

---

## Documentation

- [x] README.md mit Usage-Beispielen
- [x] docs/ Folder mit Guides
- [ ] Troubleshooting-Sektion
- [ ] Mehr Beispiele

---

_Last updated: 2026-02-09_
