# Workflow Specification: valuation-check

**Module:** sfa
**Category:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Schnelle Bewertungseinschätzung — ist das Unternehmen über- oder unterbewertet?

**Description:** Kompakter Check der wichtigsten Bewertungskennzahlen (KGV, KBV, EV/EBITDA) im Branchenvergleich. Schneller als analyze-stock.

**Workflow Type:** Non-document (direkte Ausgabe)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker-Eingabe | Ticker erfragen |
| 2 | Kennzahlen holen | Bewertungskennzahlen laden |
| 3 | Branchenvergleich | Mit Branchendurchschnitt vergleichen |
| 4 | Einschätzung | Über-/Unterbewertet mit kurzer Begründung |

---

## Workflow Inputs

### Required Inputs

- **Ticker:** Aktiensymbol

---

## Workflow Outputs

- Direkte Ausgabe (kein gespeichertes Dokument)

---

## Agent Integration

### Primary Agent

Viktor (Fundamental-Analyst)

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
