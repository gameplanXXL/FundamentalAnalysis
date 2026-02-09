---
name: compare-cryptos
description: Vergleich mehrerer Crypto-Assets
installed_path: '{project-root}/_bmad/cfa/workflows/compare-cryptos'
outputFile: '{analysis_artifacts}/comparisons/compare-{tickers}-{date}.md'
---

# Compare Cryptos

**Goal:** Vergleich von 2-5 Crypto-Assets anhand von Marktdaten, Tokenomics und Supply-Dynamik.

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

"**Welche Crypto-Assets soll ich vergleichen?**

Bitte gib 2-5 Ticker an (z.B. BTC-USD, ETH-USD, SOL-USD)."

**Warte auf Eingabe.** Validiere alle Ticker.

### Step 1b: Vorhandene Reports pruefen

Lies `{project-root}/_bmad-output/report-registry.yaml`. Suche unter `cryptos._comparisons` und fuer jeden einzelnen Ticker unter `cryptos.{TICKER}` nach vorhandenen Reports.

- **Falls vorhanden:** Zeige eine kurze Uebersicht der vorhandenen Comparison-Reports und individuellen Reports (Analysis, Decision, Tokenomics) fuer die genannten Assets. Nutze bestehende Erkenntnisse als Kontext fuer den Vergleich.
- **Falls nicht vorhanden oder Registry fehlt:** Normal fortfahren, kein Fehler.

**Wichtig:** IMMER frische Marktdaten via EODHD holen — vorhandene Reports ersetzen keine aktuellen Daten, sie liefern nur Kontext.

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

### Step 6: Report-Registry aktualisieren

Fuehre folgenden Befehl aus, um die Report-Registry zu aktualisieren:

`npx tsx src/report-index.ts`

Dies stellt sicher, dass der soeben erstellte Report fuer zukuenftige Workflows auffindbar ist.
