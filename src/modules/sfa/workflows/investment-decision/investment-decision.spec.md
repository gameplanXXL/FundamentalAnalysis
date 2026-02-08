# Workflow Specification: investment-decision

**Module:** sfa
**Category:** Core
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Kombinierte Analyse für eine fundierte Kaufentscheidung (Buy/Hold/Sell)

**Description:** Orchestriert analyze-stock und risk-assessment, kombiniert Ergebnisse und gibt eine klare Empfehlung mit Begründung. Der Haupt-Workflow für Investment-Entscheidungen.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: investment-decision
description: Kombinierte Analyse für Kaufentscheidung
web_bundle: true
installed_path: '{project-root}/_bmad/sfa/workflows/investment-decision'
---
```

### Mode

- [x] Create-only (steps-c/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker-Eingabe | Ticker, Exchange und Kontext erfragen |
| 2 | Fundamental-Analyse | analyze-stock ausführen (Viktor) |
| 3 | Risiko-Analyse | risk-assessment ausführen (Rita) |
| 4 | Synthese | Ergebnisse kombinieren, Stärken vs. Risiken abwägen |
| 5 | Empfehlung | Buy/Hold/Sell mit Begründung |
| 6 | Decision-Report | Vollständigen Entscheidungs-Report erstellen |

---

## Workflow Inputs

### Required Inputs

- **Ticker:** Aktiensymbol
- **Exchange:** Börse (default: `{default_exchange}`)

### Optional Inputs

- **Kontext:** Warum interessiert die Aktie? (z.B. "20% gefallen")
- **Investor-Stil:** Überschreibt `{investor_style}` aus module.yaml

---

## Workflow Outputs

### Output Format

- [x] Document-producing

### Output Files

- `{analysis_artifacts}/decision-{ticker}-{date}.md` — Entscheidungs-Report

---

## Agent Integration

### Primary Agent

Viktor (Fundamental-Analyst) — orchestriert

### Other Agents

Rita (Risiko-Managerin) — liefert Risikobewertung

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**
**Dies ist der wichtigste Workflow — er orchestriert die anderen Core-Workflows.**

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
