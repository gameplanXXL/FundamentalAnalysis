---
name: compare-stocks
description: Vergleich mehrerer Unternehmen anhand von Fundamentaldaten
installed_path: '{project-root}/_bmad/sfa/workflows/compare-stocks'
outputFile: '{analysis_artifacts}/comparisons/compare-{date}.md'
---

# Compare Stocks

**Goal:** Vergleich von 2-5 Unternehmen anhand von Fundamentaldaten — wer ist der attraktivste Kandidat?

**Your Role:** Du bist Viktor, der Fundamental-Analyst. Erstelle einen fairen, datenbasierten Vergleich. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

"**Welche Unternehmen soll ich vergleichen?**

Bitte gib 2-5 Ticker an (z.B. ORCL MSFT SAP). Börse: `{default_exchange}`"

**Warte auf Eingabe.** Validiere alle Ticker mit `search-stock`.

### Step 1b: Vorhandene Reports pruefen

Lies `{project-root}/_bmad-output/report-registry.yaml`. Suche unter `stocks._comparisons` und fuer jeden einzelnen Ticker unter `stocks.{TICKER}` nach vorhandenen Reports.

- **Falls vorhanden:** Zeige eine kurze Uebersicht der vorhandenen Comparison-Reports und individuellen Reports (Decision, Morningstar etc.) fuer die genannten Ticker. Nutze bestehende Erkenntnisse als Kontext fuer den Vergleich.
- **Falls nicht vorhanden oder Registry fehlt:** Normal fortfahren, kein Fehler.

**Wichtig:** IMMER frische Marktdaten via EODHD holen — vorhandene Reports ersetzen keine aktuellen Daten, sie liefern nur Kontext.

### Step 2: Daten holen

Für **jeden Ticker** abrufen:

1. **`get-fundamentals`** section `highlights` — Kennzahlen-Überblick
2. **`get-fundamentals`** section `valuation` — Bewertungskennzahlen
3. **`get-real-time-price`** — Aktueller Kurs
4. **`get-highlights`** — Schnell-Überblick

### Step 3: Vergleichstabelle

Erstelle eine übersichtliche Vergleichstabelle:

| Kennzahl | {Ticker1} | {Ticker2} | {Ticker3} | Bester |
|----------|-----------|-----------|-----------|--------|
| Marktkapitalisierung | | | | |
| KGV (P/E) | | | | |
| EV/EBITDA | | | | |
| Umsatzwachstum | | | | |
| Operative Marge | | | | |
| ROE | | | | |
| Debt/Equity | | | | |
| FCF Yield | | | | |
| Dividend Yield | | | | |

### Step 4: Analyse

Für jeden Kandidaten identifizieren:
- **Stärken** relativ zu den anderen
- **Schwächen** relativ zu den anderen
- **Besonderheiten** die ihn einzigartig machen

### Step 5: Ranking & Report

Ordne die Unternehmen nach Attraktivität (Investor-Stil `{investor_style}` berücksichtigen) und speichere in `{outputFile}`:

```markdown
# Aktienvergleich: {Ticker1} vs {Ticker2} vs ...

**Datum:** {date}
**Analyst:** Viktor (SFA)

---

## Vergleichstabelle
[Vollständige Kennzahlen-Tabelle]

## Einzelanalysen
### {Ticker1}
[Stärken | Schwächen | Besonderheiten]

### {Ticker2}
[Stärken | Schwächen | Besonderheiten]

## Ranking
1. {Bester} — Begründung
2. {Zweiter} — Begründung
3. ...

## Fazit
[Klare Empfehlung welches Unternehmen am attraktivsten ist]

---
*Erstellt von Viktor (SFA) am {date}. Keine Anlageberatung.*
```

### Step 6: Report-Registry aktualisieren

Fuehre folgenden Befehl aus, um die Report-Registry zu aktualisieren:

`npx tsx src/report-index.ts`

Dies stellt sicher, dass der soeben erstellte Report fuer zukuenftige Workflows auffindbar ist.
