# Workflow Specification: risk-assessment

**Module:** sfa
**Category:** Core
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Vollständige Risikobewertung und Red-Flag-Erkennung für ein Unternehmen

**Description:** Analysiert Schuldenstruktur, Insider-Transaktionen, Audit-Hinweise, Margin-Trends und identifiziert potenzielle Warnsignale. Bewertet das Gesamtrisiko.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: risk-assessment
description: Risikobewertung und Red-Flag-Erkennung
web_bundle: true
installed_path: '{project-root}/_bmad/sfa/workflows/risk-assessment'
---
```

### Mode

- [x] Create-only (steps-c/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker-Eingabe | Ticker und Exchange erfragen |
| 2 | Daten holen | Fundamentaldaten und Insider-Daten laden |
| 3 | Schuldenanalyse | Verschuldungsgrad, Zinsdeckung, Fälligkeiten |
| 4 | Red Flag Scan | Warnsignale identifizieren |
| 5 | Trend-Analyse | Verschlechterung über Zeit erkennen |
| 6 | Risiko-Report | Report mit Risiko-Rating erstellen |

---

## Workflow Inputs

### Required Inputs

- **Ticker:** Aktiensymbol
- **Exchange:** Börse (default: `{default_exchange}`)

### Optional Inputs

- **Analyse-Daten:** Ergebnisse aus analyze-stock (falls vorhanden)

---

## Workflow Outputs

### Output Format

- [x] Document-producing

### Output Files

- `{analysis_artifacts}/risk-{ticker}-{date}.md` — Risiko-Report

---

## Agent Integration

### Primary Agent

Rita (Risiko-Managerin)

### Other Agents

Kann Daten von Viktor (analyze-stock) empfangen.

---

## MCP-Tools benötigt

- `get-fundamentals` — Bilanzdaten, Schulden
- `get-insider-transactions` — Insider-Käufe/-Verkäufe
- `get-financial-news` — Aktuelle Nachrichten

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
