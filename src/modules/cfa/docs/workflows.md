# CFA Workflows

## Core Workflows

### analyze-crypto

Vollstaendige Fundamentalanalyse eines Crypto-Assets.

**Agent:** Satoshi
**Output:** `crypto/analysis/analyze-{ticker}-{date}.md`

**Was wird analysiert:**
- Markt-Positionierung (MarketCap, Dominance, Volumen)
- Supply-Dynamik (Circulating, Total, Max Supply)
- Preis-Analyse (ATH/ATL-Distanz, History)
- News-Sentiment

**Beispiel:**
> "Analysiere Ethereum fuer mich"

---

### crypto-decision

Kombinierte BUY/HOLD/SELL-Empfehlung von Satoshi und Cassandra.

**Agents:** Satoshi + Cassandra
**Output:** `crypto/decisions/decision-{ticker}-{date}.md`

**Entscheidungs-Faktoren:**
- Tokenomics (25%)
- Markt-Position (20%)
- Supply-Dynamik (20%)
- Risiko-Profil (20%)
- News/Sentiment (15%)

**Beispiel:**
> "Soll ich Solana kaufen?"

---

### compare-cryptos

Vergleich von 2-5 Crypto-Assets anhand von Marktdaten.

**Agent:** Satoshi
**Output:** `crypto/comparisons/compare-{tickers}-{date}.md`

**Vergleichs-Dimensionen:**
- Kurs, MarketCap, Dominance
- Volumen und Vol/MCap-Ratio
- Supply-Verhaeltnis
- ATH-Distanz
- News-Sentiment

**Beispiel:**
> "Vergleiche BTC, ETH und SOL"

---

## Feature Workflows

### market-overview

Globale Crypto-Markt-Uebersicht mit Phase-Bestimmung.

**Agent:** Satoshi
**Output:** `crypto/market/market-overview-{date}.md`

**Markt-Phasen:**
- Bull, Accumulation, Bear, Euphoria
- Basierend auf Dominance, ATH-Distanzen, Volumen-Trends

**Beispiel:**
> "Wie steht der Crypto-Markt?"

---

### token-economics

Tokenomics Deep-Dive fuer ein einzelnes Asset.

**Agent:** Satoshi
**Output:** `crypto/tokenomics/tokenomics-{ticker}-{date}.md`

**Analyse-Punkte:**
- Supply-Mechanik (Halving, Burn, Staking)
- Inflation/Deflation
- FDV vs MarketCap
- Verwaesserungs-Risiko

**Beispiel:**
> "Erklaere mir die Tokenomics von Ethereum"

---

## Utility Workflows

### fetch-crypto-data

Interner Workflow zum Holen von Rohdaten. Wird von anderen Workflows aufgerufen.

---

### explain-metric

Crypto-Metrik verstaendlich erklaeren — mit Beispielen.

**Agent:** Satoshi

**Beispiel:**
> "Was bedeutet Market Cap Dominance?"
