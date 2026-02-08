# TODO: SFA: Stock Fundamental Analysis

Development roadmap for sfa module.

---

## Infrastructure

- [ ] EODHD MCP Server erstellen (siehe `_bmad-output/bmb-creations/modules/prompt-eodhd-mcp-server.md`)
- [ ] MCP Server in `.mcp.json` registrieren
- [ ] `make start` / `make dev` / `make build` testen
- [ ] API-Verbindung verifizieren

---

## Agents to Build

- [ ] **Viktor** (Fundamental-Analyst)
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/analyst.spec.md`

- [ ] **Rita** (Risiko-Managerin)
  - Use: `bmad:bmb:agents:agent-builder`
  - Spec: `agents/risk-manager.spec.md`

---

## Workflows to Build

### Core Workflows
- [ ] **analyze-stock** — Vollständige Fundamentalanalyse
  - Spec: `workflows/analyze-stock/analyze-stock.spec.md`

- [ ] **risk-assessment** — Risikobewertung & Red Flags
  - Spec: `workflows/risk-assessment/risk-assessment.spec.md`

- [ ] **investment-decision** — Kombinierte Kaufentscheidung
  - Spec: `workflows/investment-decision/investment-decision.spec.md`

### Feature Workflows
- [ ] **compare-stocks** — Vergleich mehrerer Unternehmen
  - Spec: `workflows/compare-stocks/compare-stocks.spec.md`

- [ ] **valuation-check** — Schnelle Bewertungseinschätzung
  - Spec: `workflows/valuation-check/valuation-check.spec.md`

- [ ] **red-flag-scan** — Schneller Warnsignal-Check
  - Spec: `workflows/red-flag-scan/red-flag-scan.spec.md`

- [ ] **sector-analysis** — Branchenanalyse
  - Spec: `workflows/sector-analysis/sector-analysis.spec.md`

- [ ] **stress-test** — Worst-Case-Szenario
  - Spec: `workflows/stress-test/stress-test.spec.md`

### Utility Workflows
- [ ] **fetch-financials** — Rohdaten von EODHD
  - Spec: `workflows/fetch-financials/fetch-financials.spec.md`

- [ ] **watchlist-update** — Watchlist prüfen
  - Spec: `workflows/watchlist-update/watchlist-update.spec.md`

- [ ] **explain-metric** — Kennzahl erklären
  - Spec: `workflows/explain-metric/explain-metric.spec.md`

---

## Installation Testing

- [ ] Test installation with `bmad install`
- [ ] Verify module.yaml prompts work correctly
- [ ] Verify all agents and workflows are discoverable

---

## Documentation

- [ ] Complete README.md with usage examples
- [ ] Enhance docs/ folder with more guides
- [ ] Add troubleshooting section
- [ ] Document configuration options

---

## Next Steps

1. Build EODHD MCP Server (separate Session)
2. Build agents using create-agent workflow
3. Build workflows using create-workflow workflow
4. Test installation and functionality
5. Iterate based on testing

---

_Last updated: 2026-02-08_
