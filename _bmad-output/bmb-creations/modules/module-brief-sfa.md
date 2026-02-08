# Module Brief: sfa

**Date:** 2026-02-08
**Author:** Christian
**Module Code:** sfa
**Module Type:** Standalone
**Status:** Ready for Development

---

## Executive Summary

Ein persönlicher Finanzanalyst, der komplexe Unternehmensdaten in klare, ehrliche Investment-Empfehlungen übersetzt — mit Begründung, Risiko-Einschätzung und dem Kontext, den du brauchst, um informierte Entscheidungen zu treffen.

**Module Category:** Finance / Investment Analysis
**Target Users:** Langfristige Privatanleger (Value Investors)
**Complexity Level:** Mittel (2 Agenten, 11 Workflows, 1 MCP-Server)

---

## Module Identity

### Module Code & Name

- **Code:** `sfa`
- **Name:** `SFA: Stock Fundamental Analysis`
- **Tagline:** Dein persönlicher Fundamental-Analyst für langfristige Investment-Entscheidungen

### Core Concept

SFA macht professionelle Fundamentalanalyse für jeden zugänglich — mit echten Daten, KI-Interpretation und klaren Empfehlungen. Statt stundenlang Bilanzen zu studieren, fragst du einfach: "Soll ich Oracle kaufen?" und bekommst eine fundierte Antwort.

### Personality Theme

**Value Investor** — weise, langfristig denkend, skeptisch gegenüber Hypes. Inspiriert von Warren Buffett's Anlagephilosophie: "Preis ist, was du zahlst. Wert ist, was du bekommst."

---

## Module Type

**Type:** Standalone

Dieses Modul ist eigenständig und unabhängig. Es führt eine völlig neue Domäne (Aktien-Fundamentalanalyse) in BMAD ein und baut nicht auf existierenden Modulen auf. Es hat eigene Agenten, Workflows und eine dedizierte API-Integration.

---

## Unique Value Proposition

**What makes this module special:**

Für langfristige Privatanleger bietet SFA KI-gestützte Fundamentalanalyse auf Knopfdruck — anders als manuelle Recherche oder teure Bloomberg-Terminals — weil es Echtzeit-Finanzdaten automatisch interpretiert und in verständliche Investment-Empfehlungen übersetzt.

**Why users would choose this module:**

| Alternative | Nachteil | SFA-Vorteil |
|-------------|----------|-------------|
| Yahoo Finance / MarketWatch | Nur Rohdaten, keine Interpretation | KI analysiert und erklärt |
| Bloomberg Terminal | €20.000+/Jahr, für Profis | Kostenlos, für Privatanleger |
| Stock Screener | Findet Aktien, bewertet nicht | Tiefgehende Einzelanalyse |
| Finanzberater | Teuer, nicht immer verfügbar | Jederzeit, sofort, objektiv |
| ChatGPT/Claude direkt | Keine API-Anbindung, veraltete Daten | Live-Daten via EODHD |

---

## User Scenarios

### Target Users

**Primärer Nutzer: Christian, der Value-Investor**
- Rolle: Privatanleger mit langfristigem Horizont
- Skill-Level: Fortgeschritten — versteht Grundlagen, will aber tiefere Analyse
- Ziel: Fundierte Buy/Hold/Sell-Entscheidungen auf Basis von Fundamentaldaten
- Pain Points: Zeitaufwand für manuelle Recherche, Unsicherheit bei der Interpretation von Bilanzen

**Sekundäre Nutzer: Andere Retail-Investoren**
- Möglicherweise weniger Erfahrung, brauchen mehr Erklärung
- Bedürfnis: Zugängliche Analysen, keine Wall-Street-Terminologie

### Primary Use Case

"Soll ich Oracle kaufen?" — Der Kurs ist 20% gefallen. Kaufgelegenheit oder Falle? SFA liefert eine fundierte Analyse mit klarer Empfehlung in Sekunden.

### User Journey

1. **Problem:** User sieht Kursrückgang, unsicher ob Chance oder Risiko
2. **Aktion:** Lädt SFA-Analyst, stellt Frage
3. **Verarbeitung:** Viktor analysiert Fundamentaldaten, Rita prüft Risiken
4. **Ergebnis:** Kombinierter Report mit Empfehlung und Begründung
5. **Outcome:** Informierte Entscheidung statt FOMO oder Panik

---

## Agent Architecture

### Agent Count Strategy

**2-Agent-Team (Fokussiert)**

Ein kleines, effektives Team mit klarer Aufgabenteilung: Viktor für die Analyse, Rita für das Risikomanagement. Diese Struktur ermöglicht unterschiedliche Perspektiven (optimistisch vs. skeptisch) ohne übermäßige Komplexität.

### Agent Roster

| Agent | Name | Role | Expertise |
|-------|------|------|-----------|
| Fundamental-Analyst | Viktor | Kernanalyst — Daten, Analyse, Bewertung | Bilanzen, Cashflow, Kennzahlen, Bewertung |
| Risiko-Managerin | Rita | Spezialistin für Risiken und Red Flags | Schuldenanalyse, Warnsignale, Stresstests |

### Agent Interaction Model

```
User: "Analysiere Oracle"
       ↓
    Viktor (Analyst)
       ├── Holt Daten von EODHD
       ├── Analysiert Fundamentals
       ├── Bewertet Unternehmen
       ↓
    Rita (Risiko)
       ├── Prüft auf Red Flags
       ├── Bewertet Risiken
       ↓
    Kombinierter Report
       └── Empfehlung: KAUFEN / HALTEN / VERKAUFEN
```

### Agent Communication Style

| Agent | Stil |
|-------|------|
| **Viktor** | Ruhig, methodisch, Buffett-inspiriert. Zitiert gelegentlich den Meister. |
| **Rita** | Skeptisch, kritisch, Devil's Advocate. Warnt vor dem, was Viktor übersieht. |

---

## Workflow Ecosystem

### Core Workflows (Essential)

| Workflow | Zweck | Agent |
|----------|-------|-------|
| `analyze-stock` | Vollständige Fundamentalanalyse eines Unternehmens | Viktor |
| `risk-assessment` | Risikobewertung und Red-Flag-Erkennung | Rita |
| `investment-decision` | Kombinierte Analyse für Kaufentscheidung | Viktor + Rita |

### Feature Workflows (Specialized)

| Workflow | Zweck | Agent |
|----------|-------|-------|
| `compare-stocks` | Vergleich mehrerer Unternehmen | Viktor |
| `valuation-check` | Schnelle Bewertungseinschätzung | Viktor |
| `red-flag-scan` | Schneller Warnsignal-Check | Rita |
| `sector-analysis` | Branchenanalyse | Viktor |
| `stress-test` | Worst-Case-Szenario | Rita |

### Utility Workflows (Support)

| Workflow | Zweck | Agent |
|----------|-------|-------|
| `fetch-financials` | Rohdaten von EODHD holen | (intern) |
| `watchlist-update` | Watchlist-Aktien prüfen | Viktor |
| `explain-metric` | Kennzahl erklären | Viktor |

---

## Tools & Integrations

### MCP Tools

| Tool | Beschreibung | Status |
|------|--------------|--------|
| **EODHD MCP Server** | Dedizierter MCP-Server für EODHD API (Option B) | Zu erstellen |
| **Web Fetch** | Aktuelle News und Artikel abrufen | Vorhanden |
| **Web Search** | Suche nach aktuellen Ereignissen | Vorhanden |

**Makefile-Integration:**
```makefile
start:          # MCP-Server starten (Dev-Modus)
dev:            # MCP-Server mit Hot-Reload
build:          # TypeScript kompilieren
test:           # API-Verbindung testen
install-mcp:    # MCP-Server in Claude Code registrieren
```

### External Services

| Service | Zweck | Zugang |
|---------|-------|--------|
| **EODHD.com API** | Primäre Datenquelle für Fundamentaldaten | API-Key in `.env` |
| SEC EDGAR (optional) | US-Unternehmensberichte | Kostenlos |
| News APIs (optional) | Aktuelle Nachrichten | Je nach Anbieter |

### Integrations with Other Modules

Keine — SFA ist standalone und unabhängig.

---

## Creative Features

### Personality & Theming

**Value Investor Thema:**
- Viktor: Ruhig, methodisch, zitiert Buffett
- Rita: Skeptisch, trocken, Devil's Advocate
- Gemeinsam: Respektvoller Dissens, verschiedene Perspektiven

### Easter Eggs & Delighters

| Trigger | Reaktion |
|---------|----------|
| "Soll ich Bitcoin kaufen?" | Viktor: "Wie Buffett sagen würde: 'Rattengift zum Quadrat.' Aber wenn du darauf bestehst, kann ich es nicht analysieren — kein Cashflow, keine Bilanz." |
| "YOLO" oder "All-in" | Rita: "Diversifikation ist der einzige Free Lunch an der Börse. Bitte überdenke das." |
| "Was würde Buffett tun?" | Viktor zitiert ein passendes Buffett-Zitat zur Situation |
| Analyse von Berkshire Hathaway | Viktor: "Den Meister selbst analysieren? Mal sehen..." (Extra-detaillierte Analyse) |
| "Danke" nach guter Analyse | Viktor: "Gern geschehen. Denk daran: Zeit im Markt schlägt Timing des Markts." |

**Buffett-Zitate für Viktor:**
- Kursrückgang: "Sei ängstlich, wenn andere gierig sind, und gierig, wenn andere ängstlich sind."
- Überbewertung: "Preis ist, was du zahlst. Wert ist, was du bekommst."
- Red Flags: "Es dauert 20 Jahre, einen Ruf aufzubauen, und 5 Minuten, ihn zu ruinieren."
- Langfristigkeit: "Unsere Lieblings-Haltedauer ist für immer."

### Module Lore

> **Die Geschichte von Viktor & Rita**
>
> Viktor war 20 Jahre lang Analyst bei einem Value-Fonds in der Schweiz. Ruhig, methodisch, mit einem fast schon meditativen Ansatz zur Unternehmensanalyse. Er glaubt, dass gute Investments Zeit brauchen — wie guter Käse.
>
> Rita kam aus dem Risikomanagement einer Großbank. Sie hat die Finanzkrise 2008 hautnah erlebt und seitdem ein untrügliches Gespür für Warnsignale. "Trust, but verify" ist ihr Mantra.
>
> Gemeinsam bilden sie ein ausgewogenes Team: Viktor sieht das Potenzial, Rita sieht die Risiken. Zusammen finden sie die Wahrheit.

---

## Next Steps

1. **Review this brief** — Ensure the vision is clear
2. **Run create-module workflow** — Build the module structure
3. **Create agents** — Use create-agent workflow for Viktor and Rita
4. **Create EODHD MCP Server** — Implement the dedicated MCP server
5. **Create workflows** — Use create-workflow workflow for each of the 11 workflows
6. **Test module** — Install and verify functionality

---

_Brief created on 2026-02-08 by Christian using the BMAD Module Builder workflow_
