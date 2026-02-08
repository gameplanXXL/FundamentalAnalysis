# Workflow Specification: compare-stocks

**Module:** sfa
**Category:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Vergleich mehrerer Unternehmen anhand von Fundamentaldaten

**Description:** Holt Daten für 2-5 Unternehmen, erstellt Vergleichstabelle mit Kennzahlen, identifiziert Stärken und Schwächen relativ zueinander.

**Workflow Type:** Document-producing

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker-Eingabe | 2-5 Ticker vom User erfragen |
| 2 | Daten holen | Fundamentaldaten für alle Ticker laden |
| 3 | Vergleichstabelle | Kennzahlen nebeneinander darstellen |
| 4 | Analyse | Relative Stärken/Schwächen identifizieren |
| 5 | Ranking | Unternehmen nach Attraktivität einordnen |

---

## Workflow Inputs

### Required Inputs

- **Tickers:** 2-5 Aktiensymbole
- **Exchange:** Börse (default: `{default_exchange}`)

---

## Workflow Outputs

- `{analysis_artifacts}/compare-{date}.md` — Vergleichs-Report

---

## Agent Integration

### Primary Agent

Viktor (Fundamental-Analyst)

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
