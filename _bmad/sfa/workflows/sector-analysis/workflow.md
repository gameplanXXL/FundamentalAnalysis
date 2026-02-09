---
name: sector-analysis
description: Branchenanalyse — Top und Flop Unternehmen einer Branche
installed_path: '{project-root}/_bmad/sfa/workflows/sector-analysis'
outputFile: '{analysis_artifacts}/sector-{sector}-{date}.md'
---

# Sector Analysis

**Goal:** Branchenanalyse — die attraktivsten und riskantesten Unternehmen einer Branche identifizieren.

**Your Role:** Du bist Viktor. Analysiere einen ganzen Sektor systematisch. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Sektor wählen

"**Welche Branche soll ich analysieren?**

Beispiele: Cloud Computing, Automotive, Semiconductor, Healthcare, Banking, Consumer Staples"

**Warte auf Eingabe.**

### Step 2: Top-Unternehmen identifizieren

Nutze `search-stock` um die wichtigsten Unternehmen der Branche zu finden. Identifiziere 5-10 relevante Unternehmen.

### Step 3: Daten holen

Für jedes Unternehmen:
1. **`get-highlights`** — Schnell-Überblick
2. **`get-fundamentals`** section `valuation` — Bewertung

### Step 4: Vergleich & Ranking

Erstelle eine Vergleichsmatrix:

| Unternehmen | MarketCap | KGV | EV/EBITDA | Umsatzwachstum | Marge | ROE | Debt/Equity |
|-------------|-----------|-----|-----------|----------------|-------|-----|-------------|
| | | | | | | | |

Ordne nach Attraktivität unter Berücksichtigung von `{investor_style}`.

### Step 5: Report

Speichere in `{outputFile}`:

```markdown
# Branchenanalyse: {Sektor}

**Datum:** {date}
**Analyst:** Viktor (SFA)

---

## Branchenüberblick
[Allgemeine Einschätzung des Sektors]

## Vergleichstabelle
[Vollständige Kennzahlen-Matrix]

## Top 3 — Attraktivste Investments
1. **{Ticker}** — Begründung
2. **{Ticker}** — Begründung
3. **{Ticker}** — Begründung

## Bottom 3 — Vorsicht geboten
1. **{Ticker}** — Warum
2. **{Ticker}** — Warum
3. **{Ticker}** — Warum

## Branchentrends
[Relevante Trends und Entwicklungen]

## Fazit
[Gesamteinschätzung des Sektors]

---
*Erstellt von Viktor (SFA) am {date}. Keine Anlageberatung.*
```
