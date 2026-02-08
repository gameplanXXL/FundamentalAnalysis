# Workflow Specification: sector-analysis

**Module:** sfa
**Category:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Branchenanalyse — Top und Flop Unternehmen einer Branche identifizieren

**Description:** Analysiert einen Sektor/Branche, vergleicht die wichtigsten Unternehmen und identifiziert die attraktivsten Investments in diesem Bereich.

**Workflow Type:** Document-producing

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Sektor wählen | Branche/Sektor vom User erfragen |
| 2 | Top-Unternehmen | Wichtigste Unternehmen der Branche laden |
| 3 | Vergleich | Fundamentaldaten vergleichen |
| 4 | Ranking | Nach Attraktivität ordnen |
| 5 | Report | Sektor-Report erstellen |

---

## Workflow Inputs

### Required Inputs

- **Sektor:** Branchenbezeichnung (z.B. "Cloud Computing", "Automotive")

---

## Workflow Outputs

- `{analysis_artifacts}/sector-{sector}-{date}.md` — Sektor-Report

---

## Agent Integration

### Primary Agent

Viktor (Fundamental-Analyst)

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
