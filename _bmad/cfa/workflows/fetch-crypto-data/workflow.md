---
name: fetch-crypto-data
description: Interner Utility-Workflow zum Holen von Crypto-Daten
installed_path: '{project-root}/_bmad/cfa/workflows/fetch-crypto-data'
---

# Fetch Crypto Data

**Goal:** Interner Utility-Workflow — holt Rohdaten von EODHD fuer ein Crypto-Asset. Wird von anderen Workflows aufgerufen.

**Your Role:** Daten-Fetcher (kein Agent noetig). Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker validieren

Input: `{ticker}` (z.B. BTC-USD)

Konstruiere den vollstaendigen EODHD-Ticker: `{ticker}.CC`

### Step 2: Daten holen

Rufe die folgenden EODHD MCP-Tools auf:

1. **`get-real-time-price`** — Aktueller Kurs, Volumen, Veraenderung
2. **`get-fundamentals`** mit filter `Statistics` — MarketCap, Supply, ATH/ATL, Dominance
3. **`get-financial-news`** mit limit 10 — Aktuelle News mit Sentiment
4. **`get-eod-price`** mit period `d`, letzte 30 Tage — Kursverlauf

### Step 3: Daten strukturieren

Gib die Daten im folgenden Format zurueck:

```
Ticker: {ticker}
Kurs: {close}
Volume: {volume}
MarketCap: {MarketCapitalization}
Circulating Supply: {CirculatingSupply}
Total Supply: {TotalSupply}
Max Supply: {MaxSupply}
Dominance: {MarketCapDominance}
ATH: {HighAllTime}
ATL: {LowAllTime}
News Count: {count}
Avg Sentiment: {average_polarity}
```

### Step 4: Fehlerbehandlung

Falls ein API-Call fehlschlaegt:
- Logge den Fehler
- Fahre mit den verbleibenden Calls fort
- Markiere fehlende Daten als "N/A"
