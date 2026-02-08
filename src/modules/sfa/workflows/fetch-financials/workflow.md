---
name: fetch-financials
description: Rohdaten von EODHD API holen und strukturiert bereitstellen
installed_path: '{project-root}/_bmad/sfa/workflows/fetch-financials'
---

# Fetch Financials

**Goal:** Interner Utility-Workflow — holt Finanzdaten von EODHD und stellt sie strukturiert bereit.

**Your Role:** Datensammler. Dieser Workflow wird von anderen Workflows aufgerufen, nicht direkt vom User. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker auflösen

Wenn der Ticker noch nicht validiert ist:
1. **`search-stock`** mit dem Ticker
2. Verifiziere: Existiert der Ticker? Richtige Börse?
3. Falls mehrdeutig: Frage nach Klärung

### Step 2: Fundamentaldaten laden

Je nach angeforderten Sections:

| Section | MCP-Tool | Verwendung |
|---------|----------|-----------|
| highlights | `get-highlights` | Schnell-Überblick |
| valuation | `get-fundamentals` section=valuation | Bewertungskennzahlen |
| balance-sheet | `get-fundamentals` section=balance-sheet-quarterly | Bilanz |
| income-statement | `get-fundamentals` section=income-statement-quarterly | GuV |
| cash-flow | `get-fundamentals` section=cash-flow-quarterly | Cashflow |
| shares-stats | `get-fundamentals` section=shares-stats | Aktienanzahl |
| earnings | `get-fundamentals` section=earnings | Gewinnhistorie |
| analyst-ratings | `get-fundamentals` section=analyst-ratings | Analysten-Einschätzungen |
| insider | `get-insider-transactions` | Insider-Transaktionen |
| dividends | `get-dividends` | Dividendenhistorie |
| news | `get-financial-news` | Aktuelle Nachrichten |
| peers | `get-peers` | Vergleichsunternehmen |

### Step 3: Kursdaten laden

1. **`get-real-time-price`** — Aktueller Kurs (15-20 Min Delay)
2. **`get-eod-price`** — Historische Kurse (falls angefordert)

### Step 4: Daten strukturieren

Stelle die Daten in einem einheitlichen Format bereit:

```
Ticker: {ticker}
Exchange: {exchange}
Name: {company_name}
Datum: {date}

--- Angeforderte Daten ---
[Strukturierte Daten je nach angeforderten Sections]
```

**Dieser Workflow produziert kein Dokument — die Daten werden an den aufrufenden Workflow zurückgegeben.**
