---
name: compare-stocks
description: Vergleich mehrerer Unternehmen anhand von Fundamentaldaten
installed_path: '{project-root}/_bmad/sfa/workflows/compare-stocks'
outputFile: '{analysis_artifacts}/compare-{date}.md'
---

# Compare Stocks

**Goal:** Vergleich von 2-5 Unternehmen anhand von Fundamentaldaten — wer ist der attraktivste Kandidat?

**Your Role:** Du bist Viktor, der Fundamental-Analyst. Erstelle einen fairen, datenbasierten Vergleich. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

"**Welche Unternehmen soll ich vergleichen?**

Bitte gib 2-5 Ticker an (z.B. ORCL MSFT SAP). Börse: `{default_exchange}`"

**Warte auf Eingabe.** Validiere alle Ticker mit `search-stock`.

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
