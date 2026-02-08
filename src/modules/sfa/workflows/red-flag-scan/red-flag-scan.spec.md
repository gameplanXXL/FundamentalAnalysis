# Workflow Specification: red-flag-scan

**Module:** sfa
**Category:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Schneller Check auf Warnsignale und Red Flags

**Description:** Kompakter Scan der wichtigsten Risikoindikatoren: Insider-Verkäufe, Goodwill-Anteil, negativer Cashflow, Audit-Wechsel, Schuldenexplosion. Schneller als risk-assessment.

**Workflow Type:** Non-document (direkte Ausgabe)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker-Eingabe | Ticker erfragen |
| 2 | Red-Flag-Daten holen | Kritische Datenpunkte laden |
| 3 | Flag-Check | Gegen Warnsignal-Checkliste prüfen |
| 4 | Ergebnis | Liste der gefundenen Red Flags |

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

Rita (Risiko-Managerin)

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
