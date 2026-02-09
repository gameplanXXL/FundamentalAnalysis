# CFA: Crypto Fundamental Analysis

Dein Crypto-Analyst fuer datengetriebene Krypto-Entscheidungen

Agenten- und Workflow-Konfiguration fuer Crypto-Fundamentalanalyse

---

## Overview

CFA macht professionelle Crypto-Analyse fuer jeden zugaenglich. Das Modul verbindet die EODHD Financial API (CC-Exchange) mit KI-gestuetzter Interpretation und liefert klare, datenbasierte Einschaetzungen — mit Tokenomics-Analyse, Risiko-Bewertung und dem Kontext, den du brauchst.

**Kernfaehigkeiten:**
- Vollstaendige Crypto-Analyse (Tokenomics, MarketCap, Supply, Sentiment)
- BUY/HOLD/SELL-Empfehlungen mit Risiko-Pruefung
- Crypto-Asset-Vergleiche
- Globale Markt-Uebersicht (Bull/Bear-Phase, Dominance)
- Tokenomics Deep-Dives
- Verstaendliche Erklaerungen von Crypto-Metriken

---

## Installation

```bash
bmad install cfa
```

---

## Quick Start

1. Installiere das Modul mit `bmad install cfa`
2. Stelle sicher, dass der EODHD MCP-Server laeuft (`make start`)
3. Starte den Crypto-Analyst-Agenten: `/cfa-analyst`
4. Frage: "Analysiere Bitcoin fuer mich"

**Fuer detaillierte Dokumentation, siehe [docs/](docs/).**

---

## Components

### Agents

| Agent | Name | Rolle | Icon |
|-------|------|-------|------|
| analyst | Satoshi | Crypto-Analyst | ₿ |
| risk-manager | Cassandra | Crypto-Risiko-Managerin | 🛡️ |

### Workflows

**Core:**
| Workflow | Zweck | Agent |
|----------|-------|-------|
| analyze-crypto | Vollstaendige Crypto-Analyse | Satoshi |
| crypto-decision | BUY/HOLD/SELL Empfehlung | Satoshi + Cassandra |
| compare-cryptos | Vergleich mehrerer Assets | Satoshi |

**Feature:**
| Workflow | Zweck | Agent |
|----------|-------|-------|
| market-overview | Globale Markt-Uebersicht | Satoshi |
| token-economics | Tokenomics Deep-Dive | Satoshi |

**Utility:**
| Workflow | Zweck | Agent |
|----------|-------|-------|
| fetch-crypto-data | Rohdaten von EODHD | (intern) |
| explain-metric | Crypto-Metrik erklaeren | Satoshi |

---

## Configuration

| Variable | Beschreibung | Default |
|----------|--------------|---------|
| `default_crypto_exchange` | Standard-Exchange (CC) | CC |
| `analysis_artifacts` | Speicherort fuer Reports | `{output_folder}/crypto-analysis` |
| `investor_style` | Investment-Stil (hodl, swing, research, balanced) | hodl |

---

## Module Structure

```
cfa/
├── module.yaml
├── README.md
├── TODO.md
├── module-help.csv
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   └── workflows.md
├── agents/
│   ├── analyst.spec.md
│   └── risk-manager.spec.md
└── workflows/
    ├── analyze-crypto/
    ├── crypto-decision/
    ├── compare-cryptos/
    ├── market-overview/
    ├── token-economics/
    ├── fetch-crypto-data/
    └── explain-metric/
```

---

## Beziehung zum SFA-Modul

CFA ist bewusst als **eigenstaendiges Modul** neben SFA konzipiert:

- **SFA** (Viktor & Rita): Aktien-Fundamentalanalyse mit Bilanzen, Cashflow, Kennzahlen
- **CFA** (Satoshi & Cassandra): Crypto-Analyse mit Tokenomics, Supply-Dynamik, On-Chain-Metriken

Beide Module teilen die EODHD API-Infrastruktur, haben aber separate Agenten, Workflows und Trigger-Logik.

---

## Prerequisites

- **EODHD API Key** in `.env` als `EODHD_API_KEY`
- **EODHD MCP Server** installiert und konfiguriert
- **Claude Code** mit MCP-Unterstuetzung

---

## Development Status

- [x] Monitor-Integration (Phase 1): Crypto-Trigger in `watchlist.yaml`
- [x] Agents: 2 agents (Satoshi, Cassandra)
- [x] Workflows: 7 workflows
- [ ] Phase 3: CoinGecko-Integration (optional)

See TODO.md for detailed status.

---

## Author

Created by Christian via BMAD Module Builder workflow

---

## License

Part of the BMAD framework.
