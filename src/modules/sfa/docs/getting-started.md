# Getting Started with SFA: Stock Fundamental Analysis

Willkommen bei SFA! Diese Anleitung hilft dir beim Einstieg.

---

## What This Module Does

SFA ist dein persönlicher Fundamental-Analyst. Es verbindet die EODHD Financial API mit KI-gestützter Interpretation und liefert fundierte Investment-Empfehlungen für langfristige Anleger.

---

## Prerequisites

1. **EODHD API Key** — Registriere dich bei [eodhd.com](https://eodhd.com/) und speichere deinen Key in `.env`:
   ```
   EODHD_API_KEY=dein_api_key_hier
   ```

2. **EODHD MCP Server** — Muss installiert und konfiguriert sein:
   ```bash
   make build && make start
   ```

---

## Installation

```bash
bmad install sfa
```

Du wirst gefragt nach:
- **Standard-Börse:** US (NYSE/NASDAQ), XETRA (Deutsche Börse), oder LSE (London)
- **Report-Speicherort:** Wo Analyse-Reports gespeichert werden
- **Investment-Stil:** Value, Growth, Dividend oder Balanced

---

## First Steps

### 1. Starte den Analyst-Agenten
```
/sfa-analyst
```
Viktor, dein Fundamental-Analyst, begrüßt dich.

### 2. Analysiere deine erste Aktie
```
AS (Analyze Stock) → Oracle
```
Viktor holt Finanzdaten und erstellt eine vollständige Analyse.

### 3. Prüfe die Risiken
```
/sfa-risk-manager
RF (Red Flag Scan) → Oracle
```
Rita scannt nach Warnsignalen.

### 4. Triff eine Entscheidung
```
/sfa-analyst
ID (Investment Decision) → Oracle
```
Viktor und Rita arbeiten zusammen für eine Empfehlung.

---

## Common Use Cases

| Use Case | Agent | Command |
|----------|-------|---------|
| "Soll ich Aktie X kaufen?" | Viktor | `ID` (Investment Decision) |
| "Wie steht Unternehmen Y da?" | Viktor | `AS` (Analyze Stock) |
| "Gibt es Warnsignale?" | Rita | `RF` (Red Flag Scan) |
| "Vergleiche A, B und C" | Viktor | `CS` (Compare Stocks) |
| "Was ist KGV?" | Viktor | `EM` (Explain Metric) |

---

## What's Next?

- Check out the [Agents Reference](agents.md) to meet Viktor and Rita
- Browse the [Workflows Reference](workflows.md) to see all 11 Workflows
- See [Examples](examples.md) for real-world usage

---

## Need Help?

1. Frage Viktor oder Rita direkt — nutze `CH` (Chat) im Menü
2. Prüfe deine Modul-Konfiguration in `module.yaml`
3. Stelle sicher, dass der EODHD MCP Server läuft
