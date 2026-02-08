# SFA: Stock Fundamental Analysis

Dein persönlicher Fundamental-Analyst für langfristige Investment-Entscheidungen

Agenten- und Workflow-Konfiguration für Aktien-Fundamentalanalyse

---

## Overview

SFA macht professionelle Fundamentalanalyse für jeden zugänglich. Das Modul verbindet die EODHD Financial API mit KI-gestützter Interpretation und liefert klare, ehrliche Investment-Empfehlungen — mit Begründung, Risiko-Einschätzung und dem Kontext, den du brauchst.

**Kernfähigkeiten:**
- Vollständige Fundamentalanalyse einzelner Unternehmen
- Risikobewertung und Red-Flag-Erkennung
- Kombinierte Buy/Hold/Sell-Empfehlungen
- Aktienvergleiche und Branchenanalysen
- Stress-Tests und Worst-Case-Szenarien

---

## Installation

```bash
bmad install sfa
```

---

## Quick Start

1. Installiere das Modul mit `bmad install sfa`
2. Stelle sicher, dass der EODHD MCP-Server läuft (`make start`)
3. Starte den Analyst-Agenten: `/sfa-analyst`
4. Frage: "Analysiere Oracle für mich"

**Für detaillierte Dokumentation, siehe [docs/](docs/).**

---

## Components

### Agents

| Agent | Name | Rolle | Icon |
|-------|------|-------|------|
| analyst | Viktor | Fundamental-Analyst | 📊 |
| risk-manager | Rita | Risiko-Managerin | ⚠️ |

### Workflows

**Core:**
| Workflow | Zweck | Agent |
|----------|-------|-------|
| analyze-stock | Vollständige Fundamentalanalyse | Viktor |
| risk-assessment | Risikobewertung & Red Flags | Rita |
| investment-decision | Kombinierte Kaufentscheidung | Viktor + Rita |

**Feature:**
| Workflow | Zweck | Agent |
|----------|-------|-------|
| compare-stocks | Vergleich mehrerer Unternehmen | Viktor |
| valuation-check | Schnelle Bewertungseinschätzung | Viktor |
| red-flag-scan | Schneller Warnsignal-Check | Rita |
| sector-analysis | Branchenanalyse | Viktor |
| stress-test | Worst-Case-Szenario | Rita |

**Utility:**
| Workflow | Zweck | Agent |
|----------|-------|-------|
| fetch-financials | Rohdaten von EODHD | (intern) |
| watchlist-update | Watchlist prüfen | Viktor |
| explain-metric | Kennzahl erklären | Viktor |

---

## Configuration

The module supports these configuration options (set during installation):

| Variable | Beschreibung | Default |
|----------|--------------|---------|
| `default_exchange` | Standard-Börse (US, XETRA, LSE) | US |
| `analysis_artifacts` | Speicherort für Reports | `{output_folder}/stock-analysis` |
| `investor_style` | Investment-Stil (value, growth, dividend, balanced) | value |

---

## Module Structure

```
sfa/
├── module.yaml
├── README.md
├── TODO.md
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   ├── workflows.md
│   └── examples.md
├── agents/
│   ├── analyst.spec.md
│   └── risk-manager.spec.md
└── workflows/
    ├── analyze-stock/
    ├── risk-assessment/
    ├── investment-decision/
    ├── compare-stocks/
    ├── valuation-check/
    ├── red-flag-scan/
    ├── sector-analysis/
    ├── stress-test/
    ├── fetch-financials/
    ├── watchlist-update/
    └── explain-metric/
```

---

## Documentation

For detailed user guides and documentation, see the **[docs/](docs/)** folder:
- [Getting Started](docs/getting-started.md)
- [Agents Reference](docs/agents.md)
- [Workflows Reference](docs/workflows.md)
- [Examples](docs/examples.md)

---

## Prerequisites

- **EODHD API Key** in `.env` als `EODHD_API_KEY`
- **EODHD MCP Server** installiert und konfiguriert
- **Claude Code** mit MCP-Unterstützung

---

## Development Status

This module is currently in development. The following components are planned:

- [ ] Agents: 2 agents (Viktor, Rita)
- [ ] Workflows: 11 workflows
- [ ] EODHD MCP Server

See TODO.md for detailed status.

---

## Author

Created by Christian via BMAD Module Builder workflow

---

## License

Part of the BMAD framework.
