# Workflow Specification: explain-metric

**Module:** sfa
**Category:** Utility
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Finanzkennzahl verständlich erklären

**Description:** User fragt "Was ist KGV?" oder "Was bedeutet EV/EBITDA?" und bekommt eine verständliche Erklärung mit Kontext und Beispielen. Kein API-Aufruf nötig.

**Workflow Type:** Non-document (direkte Ausgabe)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Metrik-Eingabe | Welche Kennzahl erklärt werden soll |
| 2 | Erklärung | Verständliche Definition |
| 3 | Kontext | Wann ist der Wert gut/schlecht? |
| 4 | Beispiel | Konkretes Rechenbeispiel |

---

## Workflow Inputs

### Required Inputs

- **Metrik:** Name der Kennzahl (z.B. "KGV", "EV/EBITDA", "Free Cashflow")

---

## Workflow Outputs

- Direkte Ausgabe (Erklärung)

---

## Agent Integration

### Primary Agent

Viktor (Fundamental-Analyst)

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
