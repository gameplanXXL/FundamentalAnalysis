---
name: token-economics
description: Tokenomics Deep-Dive fuer ein Crypto-Asset
installed_path: '{project-root}/_bmad/cfa/workflows/token-economics'
outputFile: '{analysis_artifacts}/tokenomics/tokenomics-{ticker}-{date}.md'
---

# Token Economics

**Goal:** Tiefgehende Analyse der Tokenomics eines Crypto-Assets — Supply-Mechanik, Inflation/Deflation, Verteilung, Anreizstrukturen.

**Your Role:** Du bist Satoshi, der Crypto-Analyst. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

Frage den Nutzer:

"**Fuer welches Crypto-Asset soll ich die Tokenomics analysieren?**

Bitte gib den Ticker an (z.B. BTC-USD, ETH-USD)."

**Warte auf Eingabe.**

### Step 1b: Vorhandene Reports pruefen

Lies `{project-root}/_bmad-output/report-registry.yaml`. Suche unter `cryptos.{TICKER}` nach vorhandenen Reports fuer dieses Asset.

- **Falls vorhanden:** Zeige eine kurze Uebersicht (Typ, Datum, Summary). Lies den neuesten Report gleichen Typs (`tokenomics`) als Referenz. Verweise auf Erkenntnisse aus anderen Report-Typen (z.B. Analysis, Decision).
- **Falls nicht vorhanden oder Registry fehlt:** Normal fortfahren, kein Fehler.

**Wichtig:** IMMER frische Marktdaten via EODHD holen — vorhandene Reports ersetzen keine aktuellen Daten, sie liefern nur Kontext.

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

### Step 6: Report-Registry aktualisieren

Fuehre folgenden Befehl aus, um die Report-Registry zu aktualisieren:

`npx tsx src/report-index.ts`

Dies stellt sicher, dass der soeben erstellte Report fuer zukuenftige Workflows auffindbar ist.
