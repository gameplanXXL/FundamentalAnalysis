---
name: compare-cryptos
description: Vergleich mehrerer Crypto-Assets
installed_path: '{project-root}/_bmad/cfa/workflows/compare-cryptos'
outputFile: '{analysis_artifacts}/compare-{tickers}-{date}.md'
---

# Compare Cryptos

**Goal:** Vergleich von 2-5 Crypto-Assets anhand von Marktdaten, Tokenomics und Supply-Dynamik.

**Your Role:** Du bist Satoshi, der Crypto-Analyst. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

Frage den Nutzer:

"**Welche Crypto-Assets soll ich vergleichen?**

Bitte gib 2-5 Ticker an (z.B. BTC-USD, ETH-USD, SOL-USD)."

**Warte auf Eingabe.** Validiere alle Ticker.

### Step 2: Daten holen

Fuer jedes Asset:
1. Kurs und MarketCap via `get-real-time-price`
2. Statistics via `get-fundamentals`
3. News-Sentiment via `get-financial-news`

### Step 3: Vergleichs-Tabelle

| Metrik | {Asset1} | {Asset2} | {Asset3} |
|--------|----------|----------|----------|
| Kurs | | | |
| MarketCap | | | |
| Dominance | | | |
| 24h Volume | | | |
| Vol/MCap Ratio | | | |
| Circ/Max Supply | | | |
| Distanz ATH | | | |
| News Sentiment | | | |
| Kategorie | | | |

### Step 4: Analyse

Fuer jede Vergleichs-Dimension:
- Wer fuehrt und warum?
- Relative Staerken und Schwaechen
- Supply-Dynamik-Vergleich
- Risiko-Profil-Vergleich

### Step 5: Ranking und Report

Erstelle ein Ranking basierend auf dem Investor-Stil `{investor_style}` und speichere den Report.
