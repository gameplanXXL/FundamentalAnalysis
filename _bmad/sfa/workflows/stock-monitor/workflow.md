---
name: stock-monitor
description: Schwellenwerte der Watchlist-Aktien interaktiv pruefen
installed_path: '{project-root}/_bmad/sfa/workflows/stock-monitor'
outputFile: '{analysis_artifacts}/monitor-report-{date}.md'
---

# Stock Monitor

**Goal:** Watchlist-Aktien gegen konfigurierte Schwellenwerte pruefen und Alerts anzeigen.

**Your Role:** Viktor liest die Watchlist-Konfiguration, ruft aktuelle Daten ab und prueft alle definierten Trigger. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Watchlist laden

Lies die Datei `{project-root}/config/watchlist.yaml` und zeige eine Uebersicht:

"**Stock Monitor — Schwellenwertpruefung**

Watchlist geladen: {Anzahl} Aktien
{Fuer jede Aktie: Ticker — Name [Status] (X Trigger konfiguriert)}"

### Step 2: Daten abrufen und Trigger pruefen

Fuer jede Aktie in der Watchlist:

1. **Preis-Trigger:**
   - `get-real-time-price` fuer aktuellen Kurs
   - Pruefen: Kurs vs. konfigurierte Schwellenwerte

2. **Fundamental-Trigger:**
   - Passende `get-fundamentals` Sections abrufen (nur was konfiguriert ist)
   - Metriken berechnen:
     - `operating_margin` = operatingIncome / totalRevenue (income-statement-quarterly)
     - `fcf` = freeCashFlow (cash-flow-quarterly)
     - `net_debt` = longTermDebt + shortLongTermDebt - cash (balance-sheet-quarterly)
     - `revenue_growth_yoy` = QuarterlyRevenueGrowthYOY (highlights)
     - `earnings_growth_yoy` = QuarterlyEarningsGrowthYOY (highlights)
     - `pe_ratio` = PERatio (highlights)
     - `dividend_yield` = DividendYield (highlights)
     - `current_ratio` = totalCurrentAssets / totalCurrentLiabilities (balance-sheet-quarterly)
     - `debt_equity` = totalLiab / totalStockholderEquity (balance-sheet-quarterly)
   - Bei `quarters > 1`: mehrere Quartale pruefen (alle muessen Bedingung erfuellen)

3. **Sentiment-Trigger:**
   - `get-insider-transactions` — letzte 30 Transaktionen
   - `insider_net_sells` = Anzahl Verkaeufe (S) minus Kaeufe (P) der letzten 3 Monate

### Step 3: Ergebnisse anzeigen

Zeige pro Aktie eine Tabelle:

```
## {TICKER} — {Name} [{Status}]
Aktueller Kurs: ${kurs}

| Status | Trigger | Aktuell | Schwelle | Aktion |
|--------|---------|---------|----------|--------|
| 🔴/✅  | {label} | {wert}  | {schwelle}| {aktion}|
```

### Step 4: Zusammenfassung

```
## Zusammenfassung
- {N} Aktien geprueft
- {M} Alert(s) ausgeloest
- Kritisch: {liste der SELL-Alerts}
- Warnung: {liste der BUY/BUY_MORE-Alerts}
- Info: {liste der REVIEW-Alerts}
```

Falls Alerts ausgeloest wurden, frage:
"**Soll ich fuer eine der alertierten Aktien eine detaillierte Analyse starten?** (Ticker eingeben oder 'nein')"

### Step 5: Report speichern

Erstelle und speichere den vollstaendigen Report in `{outputFile}` im gleichen Format wie die Console-Ausgabe, aber als Markdown.

---

## Hinweise

- Diesen Workflow kann man auch automatisch per CLI ausfuehren: `make monitor-dev`
- Die Konfiguration in `config/watchlist.yaml` kann jederzeit angepasst werden
- Neue Trigger werden nach einer Investment-Entscheidung automatisch vorgeschlagen (siehe [ID] Workflow Step 7)
