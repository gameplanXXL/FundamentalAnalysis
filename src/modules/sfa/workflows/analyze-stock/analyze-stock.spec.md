# Workflow Specification: analyze-stock

**Module:** sfa
**Category:** Core
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Vollständige Fundamentalanalyse eines einzelnen Unternehmens

**Description:** Holt Finanzdaten von EODHD (Bilanz, GuV, Cashflow, Kennzahlen), interpretiert die Daten und erstellt einen umfassenden Analyse-Report mit Bewertung.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: analyze-stock
description: Vollständige Fundamentalanalyse eines Unternehmens
web_bundle: true
installed_path: '{project-root}/_bmad/sfa/workflows/analyze-stock'
---
```

### Mode

- [x] Create-only (steps-c/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker-Eingabe | Ticker und Exchange vom User erfragen |
| 2 | Daten holen | Fundamentaldaten via EODHD MCP-Server laden |
| 3 | Bilanzanalyse | Bilanz, GuV, Cashflow interpretieren |
| 4 | Kennzahlen | KGV, KBV, EV/EBITDA, Margins etc. bewerten |
| 5 | Bewertung | Über-/Unterbewertung einschätzen |
| 6 | Report erstellen | Analyse-Report generieren und speichern |

---

## Workflow Inputs

### Required Inputs

- **Ticker:** Aktiensymbol (z.B. ORCL, MSFT)
- **Exchange:** Börse (default aus module.yaml: `{default_exchange}`)

### Optional Inputs

- **Zeitraum:** Wie viele Jahre zurück analysieren (default: 5)
- **Vergleich:** Mit Branche vergleichen (default: ja)

---

## Workflow Outputs

### Output Format

- [x] Document-producing

### Output Files

- `{analysis_artifacts}/analyze-{ticker}-{date}.md` — Vollständiger Analyse-Report

---

## Agent Integration

### Primary Agent

Viktor (Fundamental-Analyst)

### Other Agents

Keine — reiner Analyse-Workflow. Ergebnis kann an Rita (risk-assessment) weitergegeben werden.

---

## MCP-Tools benötigt

- `get-fundamentals` — Bilanzdaten
- `get-eod-price` — Historische Kurse
- `get-real-time-price` — Aktueller Kurs

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
