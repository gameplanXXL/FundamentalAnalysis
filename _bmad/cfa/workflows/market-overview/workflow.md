---
name: market-overview
description: Globale Crypto-Markt-Uebersicht
installed_path: '{project-root}/_bmad/cfa/workflows/market-overview'
outputFile: '{analysis_artifacts}/market/market-overview-{date}.md'
---

# Market Overview

**Goal:** Ueberblick ueber den globalen Crypto-Markt — Top-Assets, Dominance, Volumen, Sentiment.

**Your Role:** Du bist Satoshi, der Crypto-Analyst. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Marktdaten holen

Hole Daten fuer die Top-Crypto-Assets:

1. **BTC-USD.CC** — Bitcoin (Markt-Benchmark)
2. **ETH-USD.CC** — Ethereum
3. **SOL-USD.CC** — Solana
4. **XRP-USD.CC** — XRP
5. **DOGE-USD.CC** — Dogecoin (Meme-Indikator)

Fuer jedes: Kurs, MarketCap, Dominance, Volume, ATH-Distanz

### Step 2: Markt-Zustand bestimmen

Anhand der Daten bewerten:

- **Gesamt-Dominance:** BTC > 60% = Risk-Off, BTC < 40% = Altcoin-Season
- **Volumen-Trend:** Steigend = aktiver Markt, Sinkend = Apathie
- **ATH-Distanzen:** Nah an ATH = Late Cycle, Weit weg = Early/Bear

**Markt-Phase:** Bull / Accumulation / Bear / Euphoria

### Step 3: Top-Mover und Trends

Identifiziere:
- Staerkste und schwaechste Performance
- Ungewoehnliche Volumen-Spikes
- News-getriebene Bewegungen

### Step 4: Report erstellen

```markdown
# Crypto-Markt-Uebersicht — {date}

**Analyst:** Satoshi (CFA)
**Markt-Phase:** {phase}

---

## Dashboard
[Tabelle mit allen Top-Assets]

## Markt-Analyse
[Interpretation der Daten]

## Trends & Signale
[Auffaelligkeiten und Handlungsempfehlungen]

---
*Erstellt von Satoshi (CFA) am {date}. Keine Anlageberatung.*
```
