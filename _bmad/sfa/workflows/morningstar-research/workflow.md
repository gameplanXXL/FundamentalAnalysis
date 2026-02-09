---
name: morningstar-research
description: MorningStar Research-Daten fuer ein Unternehmen sammeln (Playwright MCP)
installed_path: '{project-root}/_bmad/sfa/workflows/morningstar-research'
outputFile: '{analysis_artifacts}/morningstar-{ticker}-{date}.md'
requires_mcp: playwright
---

# MorningStar Research

**Goal:** Vollstaendige MorningStar-Research-Daten fuer ein einzelnes Unternehmen sammeln — Finanzdaten, Bewertung, Analyst Reports, Moat-Rating.

**Your Role:** Du bist Viktor, der Fundamental-Analyst. Du nutzt den Playwright MCP Browser, um dich bei MorningStar einzuloggen und systematisch alle relevanten Daten zu extrahieren. Kommuniziere in `{communication_language}`.

**Wichtig:** Verhalte dich wie ein menschlicher Nutzer. Rufe Seiten zuegig aber nicht zu schnell ab. Warte zwischen Aktionen 2-5 Sekunden (variiere zufaellig). Scrolle natuerlich durch Seiten. Klicke nicht sofort nach dem Laden.

---

## VORAUSSETZUNGEN

- Playwright MCP Server muss in `.mcp.json` registriert sein
- Environment-Variablen muessen gesetzt sein:
  - `RESEARCH_MORNINGSTAR_URL` — MorningStar Base-URL
  - `RESEARCH_MORNINGSTAR_LOGIN` — Login-E-Mail
  - `RESEARCH_MORNINGSTAR_PASSWORD` — Passwort
- Der Ticker muss in `config/watchlist.yaml` unter `morningstar_exchanges` gemappt sein

---

## MENSCHLICHES BROWSING-VERHALTEN

**KRITISCH:** Bei JEDER Aktion zwischen den Playwright-Tool-Aufrufen:

1. **Wartezeiten variieren:** Nach jeder Navigation oder Klick-Aktion, warte 2-5 Sekunden (variiere zufaellig zwischen den Aufrufen). Nutze `browser_wait_for` mit zufaelligen Millisekunden (2000-5000ms).
2. **Natuerliches Scrollen:** Wenn eine Seite geladen ist, scrolle erst langsam nach unten bevor du Daten extrahierst. Nutze `browser_press_key` mit "PageDown" und warte dazwischen.
3. **Keine Parallelitaet:** Rufe Seiten NACHEINANDER auf, nie parallel.
4. **Pausen zwischen Seiten:** Zwischen dem Abruf verschiedener Seiten (quote -> financials -> valuation) warte 3-8 Sekunden.
5. **Session natuerlich halten:** Navigiere ueber Links auf der Seite wenn moeglich, statt direkt URLs einzugeben.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe und Validierung

Frage den Nutzer:

"**Welches Unternehmen soll ich bei MorningStar recherchieren?**

Bitte gib den Ticker an (z.B. ORCL, MSFT, AAPL).
Boerse: `{default_exchange}` (oder andere angeben)"

**Warte auf Eingabe.**

1. Validiere den Ticker mit `search-stock` (EODHD MCP)
2. Schlage den MorningStar Exchange-Code nach in `config/watchlist.yaml` unter `morningstar_exchanges`
3. Falls kein Mapping vorhanden: Frage den Nutzer nach dem Exchange-Code (xnas/xnys/pinx) und informiere, dass der Ticker in der Watchlist ergaenzt werden sollte

Setze Variablen:
- `{ticker}` — z.B. `AAPL`
- `{ticker_lower}` — z.B. `aapl` (fuer URLs)
- `{ms_exchange}` — z.B. `xnas`
- `{ms_base_url}` — aus Environment `RESEARCH_MORNINGSTAR_URL`

### Step 2: MorningStar Login

**Ziel:** Einloggen bei MorningStar um auf Premium-Daten zuzugreifen.

1. Navigiere zur Login-Seite:
   ```
   browser_navigate: {ms_base_url}
   ```
   Warte 3 Sekunden (Seite laden lassen).

2. Mache einen Snapshot um den aktuellen Zustand zu sehen:
   ```
   browser_snapshot
   ```

3. Suche den "Sign In" oder "Log In" Link/Button und klicke darauf:
   ```
   browser_click: [den Login-Link/Button]
   ```
   Warte 2-4 Sekunden.

4. Mache erneut einen Snapshot um das Login-Formular zu sehen:
   ```
   browser_snapshot
   ```

5. Fuege die Login-Daten ein:
   - Finde das E-Mail/Username-Feld und fuelle es aus:
     ```
     browser_fill: E-Mail-Feld mit RESEARCH_MORNINGSTAR_LOGIN
     ```
     Warte 1-2 Sekunden (menschliche Tipp-Pause).
   - Finde das Passwort-Feld und fuelle es aus:
     ```
     browser_fill: Passwort-Feld mit RESEARCH_MORNINGSTAR_PASSWORD
     ```
     Warte 1-2 Sekunden.

6. Klicke den "Sign In" / "Log In" Button:
   ```
   browser_click: Submit-Button
   ```
   Warte 5 Sekunden (Login-Verarbeitung).

7. Verifiziere den Login:
   ```
   browser_snapshot
   ```
   Pruefe ob der Login erfolgreich war (Benutzername sichtbar, kein Fehler).
   Falls Login fehlschlaegt: Informiere den Nutzer und brich ab.

**HINWEIS:** Die Login-Credentials kommen aus den Environment-Variablen. Lese sie NICHT aus .env direkt, sondern verwende die Werte die der Nutzer in der Session bereitgestellt hat oder die ueber die Konfiguration verfuegbar sind. Frage den Nutzer nach den Credentials falls sie nicht verfuegbar sind.

### Step 3: Quote-Seite (Uebersicht + Ratings)

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/quote`

1. Navigiere zur Quote-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/quote
   ```
   Warte 3-5 Sekunden.

2. Mache einen Snapshot:
   ```
   browser_snapshot
   ```

3. Scrolle langsam durch die Seite (2x PageDown mit Pausen):
   ```
   browser_press_key: PageDown → warte 2 Sekunden
   browser_press_key: PageDown → warte 2 Sekunden
   ```

4. Extrahiere aus dem Snapshot:
   - **MorningStar Star Rating** (1-5 Sterne)
   - **Fair Value Estimate** (Dollar-Betrag + Datum)
   - **Uncertainty Rating** (Low/Medium/High/Very High/Extreme)
   - **1-Star Price** (Ueberbewertungs-Schwelle)
   - **5-Star Price** (Unterbewertungs-Schwelle)
   - **Economic Moat** (Wide/Narrow/None)
   - **Capital Allocation Rating**
   - **Aktueller Kurs**, Day Range, 52-Week Range
   - **Bewertungskennzahlen:** P/E, P/S, P/B, P/CF
   - **Dividende:** Trailing Yield, Forward Yield
   - **Market Cap, Shares Outstanding**
   - **Bulls Say / Bears Say** Zusammenfassungen
   - **Competitor Comparison** Tabelle

5. Speichere alle extrahierten Daten als strukturierte Notizen.

Warte 4-7 Sekunden vor dem naechsten Seitenabruf.

### Step 4: Financials-Seite (Finanzdaten)

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/financials`

1. Navigiere zur Financials-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/financials
   ```
   Warte 3-5 Sekunden.

2. **Income Statement (Standard-Ansicht):**
   ```
   browser_snapshot
   ```
   Extrahiere: Revenue, Operating Income, Net Income, EPS, Margen (letzte 5 Jahre)
   Scrolle langsam durch die Tabelle.

3. Warte 3-5 Sekunden.

4. **Balance Sheet** — Klicke auf den "Balance Sheet" Tab:
   ```
   browser_click: "Balance Sheet" Tab/Button
   ```
   Warte 3-5 Sekunden.
   ```
   browser_snapshot
   ```
   Extrahiere: Total Assets, Total Liabilities, Equity, Cash, Debt, Current Ratio

5. Warte 3-5 Sekunden.

6. **Cash Flow** — Klicke auf den "Cash Flow" Tab:
   ```
   browser_click: "Cash Flow" Tab/Button
   ```
   Warte 3-5 Sekunden.
   ```
   browser_snapshot
   ```
   Extrahiere: Operating Cash Flow, Capital Expenditure, Free Cash Flow, Dividends Paid

7. Speichere alle Finanzdaten strukturiert.

Warte 5-8 Sekunden vor dem naechsten Seitenabruf.

### Step 5: Valuation-Seite (Bewertung)

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/valuation`

1. Navigiere zur Valuation-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/valuation
   ```
   Warte 3-5 Sekunden.

2. Mache einen Snapshot und scrolle:
   ```
   browser_snapshot
   browser_press_key: PageDown → warte 2 Sekunden
   browser_snapshot
   ```

3. Extrahiere:
   - **Historische P/E-Ratios** (letzte 5-10 Jahre)
   - **Price/Cash Flow** Entwicklung
   - **EV/EBITDA** Entwicklung
   - **Price/Book** Entwicklung
   - **Dividend Yield** Entwicklung

Warte 4-7 Sekunden vor dem naechsten Seitenabruf.

### Step 6: Dividends-Seite (Dividendenhistorie)

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/dividends`

1. Navigiere zur Dividends-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/dividends
   ```
   Warte 3-5 Sekunden.

2. Snapshot und Extraktion:
   ```
   browser_snapshot
   ```
   Extrahiere:
   - **Dividenden-Historie** (letzte 10 Jahre)
   - **Payout Ratio** Entwicklung
   - **Stock Splits**

Warte 3-6 Sekunden vor dem naechsten Seitenabruf.

### Step 7: Ownership-Seite (Besitzstruktur)

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/ownership`

1. Navigiere zur Ownership-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/ownership
   ```
   Warte 3-5 Sekunden.

2. Snapshot und Extraktion:
   ```
   browser_snapshot
   browser_press_key: PageDown → warte 2 Sekunden
   browser_snapshot
   ```
   Extrahiere:
   - **Top Institutionelle Halter**
   - **Konzentrierte Halter**
   - **Kauf/Verkauf-Aktivitaet** (Buying/Selling)

Warte 4-7 Sekunden vor dem naechsten Seitenabruf.

### Step 8: Executive-Seite (Management + Insider)

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/executive`

1. Navigiere zur Executive-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/executive
   ```
   Warte 3-5 Sekunden.

2. Snapshot und Extraktion:
   ```
   browser_snapshot
   browser_press_key: PageDown → warte 2 Sekunden
   browser_snapshot
   ```
   Extrahiere:
   - **Key Executives** mit Verguetung (5-Jahres-Trend)
   - **Board of Directors**
   - **Insider-Transaktionen** (Kaeufe/Verkaeufe mit Daten und Betraegen)

Warte 3-6 Sekunden vor dem naechsten Seitenabruf.

### Step 9: Earnings Transcripts (falls verfuegbar)

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/earnings-transcripts`

1. Navigiere zur Earnings-Transcripts-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/earnings-transcripts
   ```
   Warte 3-5 Sekunden.

2. Snapshot:
   ```
   browser_snapshot
   ```
   Extrahiere (falls verfuegbar):
   - **Letzter Earnings Call** Zusammenfassung
   - **Key Quotes** des Managements
   - **Guidance** (falls erwaehnt)

Falls kein Zugriff (Paywall): Notiere dies und fahre fort.

Warte 3-5 Sekunden.

### Step 10: News-Seite

**URL:** `{ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/news`

1. Navigiere zur News-Seite:
   ```
   browser_navigate: {ms_base_url}/stocks/{ms_exchange}/{ticker_lower}/news
   ```
   Warte 3-5 Sekunden.

2. Snapshot:
   ```
   browser_snapshot
   ```
   Extrahiere:
   - **Letzte 5-10 News-Headlines** mit Datum und Quelle
   - **MorningStar-eigene Artikel** (falls vorhanden)

### Step 11: Browser schliessen

```
browser_close
```

### Step 12: Report erstellen

Erstelle den konsolidierten MorningStar-Research-Report und speichere ihn in `{outputFile}`:

```markdown
# MorningStar Research: {TICKER} — {Company Name}

**Datum:** {date}
**Quelle:** MorningStar.com (Premium)
**Analyst:** Viktor (SFA-Modul)

---

## MorningStar Ratings

| Rating | Wert |
|--------|------|
| Star Rating | {1-5 Sterne} |
| Fair Value Estimate | ${fair_value} (Stand: {fv_date}) |
| Uncertainty Rating | {uncertainty} |
| Economic Moat | {moat} |
| Capital Allocation | {cap_alloc} |
| 1-Star Price (ueberbewertet) | ${1_star} |
| 5-Star Price (unterbewertet) | ${5_star} |
| Aktueller Kurs | ${current_price} |

### Bewertungs-Einschaetzung

{Interpretation: Aktueller Kurs vs. Fair Value, Margin of Safety, Star Rating Bedeutung}

---

## Finanzdaten (Letzte 5 Jahre)

### Income Statement

| Jahr | Revenue | Op. Income | Net Income | EPS | Op. Margin |
|------|---------|-----------|------------|-----|-----------|
| ... | ... | ... | ... | ... | ... |

### Balance Sheet

| Jahr | Total Assets | Total Debt | Equity | Cash | Current Ratio |
|------|-------------|-----------|--------|------|--------------|
| ... | ... | ... | ... | ... | ... |

### Cash Flow

| Jahr | Op. CF | CapEx | FCF | Dividends | FCF Yield |
|------|--------|-------|-----|-----------|----------|
| ... | ... | ... | ... | ... | ... |

---

## Bewertungs-Historie

| Jahr | P/E | P/CF | EV/EBITDA | P/B | Div Yield |
|------|-----|------|-----------|-----|----------|
| ... | ... | ... | ... | ... | ... |

---

## Dividenden-Historie

{Tabelle mit Dividenden der letzten 10 Jahre, Payout Ratio, Splits}

---

## Besitzstruktur

### Top Institutionelle Halter
{Top 10 Halter mit Prozentanteilen}

### Kauf/Verkauf-Aktivitaet
{Zusammenfassung: Netto-Kaeufer vs. Netto-Verkaeufer}

---

## Management & Insider

### Key Executives
{Name, Titel, Verguetung}

### Insider-Transaktionen
{Letzte relevante Kaeufe/Verkaeufe}

---

## Earnings Call Highlights

{Zusammenfassung des letzten Earnings Calls, Key Quotes, Guidance}

---

## Aktuelle News

{Letzte 5-10 Headlines mit Datum}

---

## Bulls Say / Bears Say

**Bulls Say:**
{MorningStar Bulls-Argumente}

**Bears Say:**
{MorningStar Bears-Argumente}

---

## Fazit

{Gesamteinschaetzung basierend auf allen MorningStar-Daten:
- Fair Value vs. aktueller Kurs
- Moat-Qualitaet
- Bilanzstaerke
- Management-Qualitaet (Capital Allocation)
- Insider-Sentiment
- Empfehlung im Kontext des {investor_style}-Stils}

---
*Generiert von Viktor (SFA-Modul) via MorningStar Research Workflow*
*Datenquelle: MorningStar.com Premium*
```

Zeige dem Nutzer den Report und informiere ueber den Speicherort.
