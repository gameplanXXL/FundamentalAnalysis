# Workflow Specification: stress-test

**Module:** sfa
**Category:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Worst-Case-Szenario-Analyse — Was passiert wenn alles schiefgeht?

**Description:** Simuliert negative Szenarien (Revenue-Einbruch, Margin-Verfall, Zinsanstieg) und bewertet die Widerstandsfähigkeit des Unternehmens.

**Workflow Type:** Document-producing

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker-Eingabe | Ticker erfragen |
| 2 | Baseline | Aktuelle Finanzsituation erfassen |
| 3 | Szenarien | Worst-Case-Szenarien definieren |
| 4 | Simulation | Auswirkungen auf Bilanz/Cashflow berechnen |
| 5 | Resilienz | Überlebensfähigkeit bewerten |
| 6 | Report | Stress-Test-Report erstellen |

---

## Workflow Inputs

### Required Inputs

- **Ticker:** Aktiensymbol

### Optional Inputs

- **Szenario:** Spezifisches Szenario (z.B. "Revenue -30%", "Zinsen +3%")

---

## Workflow Outputs

- `{analysis_artifacts}/stress-{ticker}-{date}.md` — Stress-Test-Report

---

## Agent Integration

### Primary Agent

Rita (Risiko-Managerin)

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
