# Prompt: EODHD MCP-Server erstellen

## Kontext

Ich baue ein BMAD-Modul namens **SFA (Stock Fundamental Analysis)** — ein Modul für fundamentale Aktienanalyse und langfristige Investment-Entscheidungen. Der Module Brief liegt unter:
`_bmad-output/bmb-creations/modules/module-brief-sfa.md`

Bevor das Modul erstellt wird, brauche ich den **dedizierten MCP-Server für die EODHD Financial API** als Infrastruktur-Grundlage.

---

## Aufgabe

Erstelle einen MCP-Server (Model Context Protocol), der die EODHD Financial API (`https://eodhd.com/`) anbindet.

---

## Technische Anforderungen

### Stack
- **TypeScript** mit Node.js
- MCP SDK (`@modelcontextprotocol/sdk`)
- Der Server läuft als stdio-basierter MCP-Server

### API-Zugang
- API-Key liegt in `.env` als `EODHD_API_KEY`
- Base URL: `https://eodhd.com/api/`
- Dokumentation: `https://eodhd.com/financial-apis/`

### Benötigte MCP-Tools (mindestens)

| Tool | EODHD Endpoint | Zweck |
|------|----------------|-------|
| `get-fundamentals` | `/fundamentals/{TICKER}` | Bilanz, GuV, Cashflow, Kennzahlen |
| `get-eod-price` | `/eod/{TICKER}` | Historische Kursdaten |
| `get-real-time-price` | `/real-time/{TICKER}` | Aktueller Kurs |
| `get-financial-news` | `/news` | Unternehmensnachrichten |
| `search-stock` | `/search/{QUERY}` | Aktien suchen nach Name/Ticker |

### Optionale Tools (nice-to-have)

| Tool | EODHD Endpoint | Zweck |
|------|----------------|-------|
| `get-dividends` | `/div/{TICKER}` | Dividendenhistorie |
| `get-insider-transactions` | `/insider-transactions` | Insider-Käufe/-Verkäufe |
| `get-highlights` | Aus fundamentals | Kurzübersicht der wichtigsten Kennzahlen |
| `get-peers` | Aus fundamentals | Vergleichsunternehmen |

### Wichtig bei den Fundamentals-Daten
- Die EODHD Fundamentals API liefert SEHR umfangreiche Daten (Bilanz, Income Statement, Cashflow, Earnings, etc.)
- Der MCP-Server sollte die relevanten Abschnitte sinnvoll als separate Filter/Parameter zugänglich machen
- Z.B. `get-fundamentals --ticker ORCL.US --section balance-sheet` oder `--section highlights`

---

## Projektstruktur

```
/  (project root)
├── src/
│   ├── mcp-server.ts          # MCP Server Entry Point
│   ├── tools/                  # Tool-Definitionen
│   │   ├── fundamentals.ts
│   │   ├── price.ts
│   │   ├── news.ts
│   │   └── search.ts
│   └── lib/
│       └── eodhd-client.ts     # API Client mit Auth
├── .env                        # EODHD_API_KEY (existiert bereits)
├── package.json
├── tsconfig.json
├── Makefile
└── .mcp.json                   # MCP-Registrierung für Claude Code
```

---

## Makefile

```makefile
start:          # MCP-Server starten (kompiliert + startet)
dev:            # MCP-Server mit Hot-Reload (tsx watch)
build:          # TypeScript kompilieren
test:           # API-Verbindung und Endpoints testen
install-mcp:    # Server in .mcp.json registrieren
```

---

## .mcp.json Integration

Der Server soll sich in die lokale `.mcp.json` eintragen lassen, damit Claude Code ihn automatisch startet:

```json
{
  "mcpServers": {
    "eodhd": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "env": {
        "EODHD_API_KEY": "${EODHD_API_KEY}"
      }
    }
  }
}
```

---

## Qualitätsanforderungen

- **Error Handling:** Sinnvolle Fehlermeldungen bei API-Fehlern (Rate Limit, ungültiger Ticker, etc.)
- **Ticker-Format:** EODHD nutzt `SYMBOL.EXCHANGE` Format (z.B. `ORCL.US`, `SAP.XETRA`). Default Exchange sollte `.US` sein, wenn nicht angegeben
- **Rate Limiting:** EODHD hat API-Limits — berücksichtigen
- **Logging:** Minimales Logging für Debugging
- **Typisierung:** Saubere TypeScript-Typen für API-Responses

---

## Testfall

Nach Fertigstellung sollte folgender Flow funktionieren:

1. `make build && make start` startet den Server
2. In Claude Code: MCP-Tool `get-fundamentals --ticker ORCL.US` liefert Oracle-Finanzdaten
3. `get-real-time-price --ticker ORCL.US` liefert aktuellen Kurs
4. `search-stock --query "Oracle"` findet Oracle mit Ticker-Info

---

## Hinweise

- Prüfe zuerst die EODHD API-Dokumentation auf aktuelle Endpoints und Response-Formate
- Der API-Key in `.env` ist bereits vorhanden
- Achte darauf, dass die Fundamentals-Daten sinnvoll gefiltert/strukturiert werden — das Roh-JSON ist sehr groß
