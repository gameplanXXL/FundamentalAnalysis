---
name: token-economics
description: Tokenomics Deep-Dive fuer ein Crypto-Asset
installed_path: '{project-root}/_bmad/cfa/workflows/token-economics'
outputFile: '{analysis_artifacts}/tokenomics-{ticker}-{date}.md'
---

# Token Economics

**Goal:** Tiefgehende Analyse der Tokenomics eines Crypto-Assets — Supply-Mechanik, Inflation/Deflation, Verteilung, Anreizstrukturen.

**Your Role:** Du bist Satoshi, der Crypto-Analyst. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

Frage den Nutzer:

"**Fuer welches Crypto-Asset soll ich die Tokenomics analysieren?**

Bitte gib den Ticker an (z.B. BTC-USD, ETH-USD)."

**Warte auf Eingabe.**

### Step 2: Daten holen

1. **`get-fundamentals`** mit `{ticker}.CC` — Statistics
2. **`get-real-time-price`** mit `{ticker}.CC` — Aktueller Kurs
3. **`get-eod-price`** mit `{ticker}.CC` — Historische Kurse

### Step 3: Supply-Analyse

Berechne und interpretiere:

- **Circulating Supply Ratio:** circulating / max
- **Inflation Rate:** (total - circulating) / circulating (geschaetzt)
- **Verbleibende Supply:** max - circulating
- **Fully Diluted Valuation:** max_supply * current_price
- **FDV/MCap Ratio:** Indikator fuer zukuenftige Verwaesserung

### Step 4: Mechanik erklaeren

Je nach Asset die spezifische Mechanik erlaeutern:

- **Bitcoin:** Halving-Zyklus, Block Reward, 21M Cap
- **Ethereum:** EIP-1559 Burn, Staking Rewards, kein Max Supply
- **PoS-Chains:** Staking APY, Slashing, Validator-Anforderungen
- **Memecoins:** Oft keine Deflation, hohe Initial-Distribution

### Step 5: Report erstellen

```markdown
# Tokenomics: {Name} ({Ticker})

**Datum:** {date}
**Analyst:** Satoshi (CFA)

---

## Supply-Dashboard
[Tabelle mit allen Supply-Metriken]

## Mechanik
[Erklaerung der Token-Mechanik]

## Inflation/Deflation
[Bewertung der Supply-Dynamik]

## Bewertungs-Implikation
[FDV vs MCap, Verwaesserungs-Risiko]

## Fazit
[Zusammenfassung der Tokenomics-Qualitaet]

---
*Erstellt von Satoshi (CFA) am {date}. Keine Anlageberatung.*
```
