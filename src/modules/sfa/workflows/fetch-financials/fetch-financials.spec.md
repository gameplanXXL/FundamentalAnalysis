# Workflow Specification: fetch-financials

**Module:** sfa
**Category:** Utility
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Rohdaten von EODHD API holen und strukturiert bereitstellen

**Description:** Interner Utility-Workflow, der von anderen Workflows aufgerufen wird. Holt Fundamentaldaten, Kurse und Nachrichten via EODHD MCP-Server.

**Workflow Type:** Non-document (Daten-Provider)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Ticker auflösen | Ticker + Exchange validieren |
| 2 | Fundamentals laden | get-fundamentals aufrufen |
| 3 | Kursdaten laden | get-eod-price + get-real-time-price |
| 4 | Daten strukturieren | Response in nutzbares Format bringen |

---

## Workflow Inputs

### Required Inputs

- **Ticker:** Aktiensymbol
- **Exchange:** Börse
- **Sections:** Welche Daten benötigt (balance-sheet, income-statement, etc.)

---

## Workflow Outputs

- Strukturierte Finanzdaten (intern, kein gespeichertes Dokument)

---

## Agent Integration

### Primary Agent

Intern — wird von anderen Workflows aufgerufen, nicht direkt vom User

---

## MCP-Tools benötigt

- `get-fundamentals`
- `get-eod-price`
- `get-real-time-price`
- `search-stock`

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
