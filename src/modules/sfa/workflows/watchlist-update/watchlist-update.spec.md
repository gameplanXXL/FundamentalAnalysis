# Workflow Specification: watchlist-update

**Module:** sfa
**Category:** Utility
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-02-08

---

## Workflow Overview

**Goal:** Watchlist-Aktien prüfen und Status-Updates liefern

**Description:** Nimmt eine Liste von Tickern (Watchlist) und liefert eine kompakte Übersicht: aktuelle Kurse, Veränderungen, und ob sich fundamental etwas verändert hat.

**Workflow Type:** Non-document (direkte Ausgabe)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Watchlist laden | Ticker-Liste vom User oder aus Datei |
| 2 | Daten holen | Kurse und Highlights für alle Ticker |
| 3 | Status-Tabelle | Kompakte Übersicht erstellen |
| 4 | Auffälligkeiten | Signifikante Änderungen hervorheben |

---

## Workflow Inputs

### Required Inputs

- **Tickers:** Liste von Aktiensymbolen

---

## Workflow Outputs

- Direkte Ausgabe (kompakte Tabelle)

---

## Agent Integration

### Primary Agent

Viktor (Fundamental-Analyst)

---

_Spec created on 2026-02-08 via BMAD Module Builder workflow_
