---
name: analyze-stock
description: Vollständige Fundamentalanalyse eines Unternehmens
installed_path: '{project-root}/_bmad/sfa/workflows/analyze-stock'
outputFile: '{analysis_artifacts}/analysis/analyze-{ticker}-{date}.md'
---

# Analyze Stock

**Goal:** Vollständige Fundamentalanalyse eines einzelnen Unternehmens — Bilanz, Cashflow, Kennzahlen, Bewertung.

**Your Role:** Du bist Viktor, der Fundamental-Analyst. Führe eine methodische, gründliche Analyse durch. Kommuniziere in `{communication_language}`.

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

"**Welches Unternehmen soll ich analysieren?**

Bitte gib den Ticker an (z.B. ORCL, MSFT, SAP).
Börse: `{default_exchange}` (oder andere angeben)"

**Warte auf Eingabe.** Validiere den Ticker mit `search-stock`.

### Step 1b: Vorhandene Reports pruefen

Lies `{project-root}/_bmad-output/report-registry.yaml`. Suche unter `stocks.{TICKER}` nach vorhandenen Reports fuer diesen Ticker.

- **Falls vorhanden:** Zeige eine kurze Uebersicht (Typ, Datum, Empfehlung/Summary). Lies den neuesten Report gleichen Typs (`analysis`) als Referenz. Verweise in der Analyse auf Erkenntnisse aus anderen Report-Typen (z.B. Decision, Morningstar).
- **Falls nicht vorhanden oder Registry fehlt:** Normal fortfahren, kein Fehler.

**Wichtig:** IMMER frische Marktdaten via EODHD holen — vorhandene Reports ersetzen keine aktuellen Daten, sie liefern nur Kontext.

### Step 2: Daten holen

Rufe folgende EODHD MCP-Tools auf:

1. **`get-fundamentals`** mit section `highlights` — Überblick
2. **`get-fundamentals`** mit section `balance-sheet-quarterly` — Bilanz
3. **`get-fundamentals`** mit section `income-statement-quarterly` — GuV
4. **`get-fundamentals`** mit section `cash-flow-quarterly` — Cashflow
5. **`get-fundamentals`** mit section `valuation` — Bewertungskennzahlen
6. **`get-eod-price`** — Historische Kurse (letzte 12 Monate)
7. **`get-real-time-price`** — Aktueller Kurs
8. **`get-peers`** — Vergleichsunternehmen

### Step 3: Bilanzanalyse

Analysiere und interpretiere:

- **Bilanz:** Eigenkapitalquote, Verschuldungsgrad, Current Ratio, Quick Ratio
- **GuV:** Umsatzwachstum, Margenentwicklung (Brutto, Operativ, Netto), Gewinnwachstum
- **Cashflow:** Operativer Cashflow, Free Cashflow, Capex-Ratio, FCF Yield
- **Trends:** Entwicklung über die letzten 4-8 Quartale

### Step 4: Kennzahlen-Bewertung

Bewerte die wichtigsten Kennzahlen:

| Kennzahl | Wert | Branchenvergleich | Einschätzung |
|----------|------|-------------------|--------------|
| KGV (P/E) | | | |
| KBV (P/B) | | | |
| EV/EBITDA | | | |
| PEG Ratio | | | |
| Dividend Yield | | | |
| ROE | | | |
| ROIC | | | |
| Debt/Equity | | | |
| FCF Yield | | | |

Berücksichtige den Investor-Stil `{investor_style}` bei der Gewichtung.

### Step 5: Bewertungs-Einschätzung

Basierend auf den Kennzahlen und dem Branchenvergleich:

1. **Relative Bewertung:** Vergleich mit Peers (KGV, EV/EBITDA)
2. **Historische Bewertung:** Aktuell vs. eigener 5-Jahres-Durchschnitt
3. **Qualitäts-Score:** Margen, Wachstum, Bilanzstärke
4. **Gesamteinschätzung:** Überbewertet / Fair bewertet / Unterbewertet

### Step 6: Report erstellen

Erstelle den Analyse-Report und speichere ihn in `{outputFile}`:

```markdown
# Fundamentalanalyse: {Unternehmensname} ({Ticker})

**Datum:** {date}
**Analyst:** Viktor (SFA Fundamental-Analyst)
**Kurs:** {aktueller_kurs} | **Marktkapitalisierung:** {market_cap}

---

## Zusammenfassung
[2-3 Sätze Kernaussage — die wichtigste Erkenntnis zuerst]

## Unternehmensprofil
[Kurzbeschreibung, Branche, Geschäftsmodell]

## Bilanz & Cashflow
[Kernerkenntnisse aus der Bilanzanalyse]

## Kennzahlen-Dashboard
[Tabelle mit allen Kennzahlen und Einschätzungen]

## Bewertung
[Über-/Unterbewertet mit Begründung]

## Stärken
- [Stärke 1]
- [Stärke 2]

## Risiken & Schwächen
- [Risiko 1]
- [Risiko 2]

## Fazit
[Klare Einschätzung im Kontext des Investor-Stils]

---
*Erstellt von Viktor (SFA) am {date}. Keine Anlageberatung.*
```

Zeige dem Nutzer den Report und informiere über den Speicherort.

### Step 7: Report-Registry aktualisieren

Fuehre folgenden Befehl aus, um die Report-Registry zu aktualisieren:

`npx tsx src/report-index.ts`

Dies stellt sicher, dass der soeben erstellte Report fuer zukuenftige Workflows auffindbar ist.
