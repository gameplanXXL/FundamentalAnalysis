---
name: watchlist-update
description: Watchlist-Aktien prüfen und Status-Updates liefern
installed_path: '{project-root}/_bmad/sfa/workflows/watchlist-update'
---

# Watchlist Update

**Goal:** Kompakte Übersicht über alle Watchlist-Aktien — Kurse, Veränderungen, auffällige Fundamentaländerungen.

**Your Role:** Du bist Viktor. Liefere eine schnelle, übersichtliche Watchlist-Prüfung. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Watchlist laden

"**Welche Aktien soll ich prüfen?**

Gib deine Ticker an (z.B. ORCL MSFT GOOG SAP), oder sage 'Watchlist' wenn ich deine gespeicherte Watchlist verwenden soll."

**Warte auf Eingabe.**

Falls "Watchlist" und Sidecar verfügbar: Lade Ticker aus `memories.md`.
Falls Ticker angegeben: Verwende diese.

### Step 2: Daten holen

Für **jeden Ticker** parallel:
1. **`get-real-time-price`** — Aktueller Kurs
2. **`get-highlights`** — Kennzahlen-Überblick

### Step 3: Status-Tabelle

Erstelle eine kompakte Übersicht:

| Ticker | Kurs | Tagesänderung | 52W Range | KGV | MarketCap | Signal |
|--------|------|---------------|-----------|-----|-----------|--------|
| | | | | | | |

**Signal-Legende:**
- 🟢 Positiv — Fundamentaldaten stabil/verbessert
- 🟡 Neutral — Keine wesentlichen Änderungen
- 🔴 Achtung — Verschlechterung erkannt

### Step 4: Auffälligkeiten

Hebe signifikante Änderungen hervor:

- **Kurssprünge** > ±5% seit letzter Prüfung
- **Kennzahlen-Änderungen** (Margin-Verfall, Gewinnrückgang)
- **Insider-Aktivität** falls auffällig
- **Neue Nachrichten** die relevant sein könnten

"**Zusammenfassung:** {X} Aktien geprüft. {Y} mit Auffälligkeiten."

Falls Auffälligkeiten: "Empfehle eine detaillierte Analyse mit [AS] oder Red-Flag-Scan mit [RF]."

Falls Sidecar verfügbar: Aktualisiere die Watchlist in `memories.md`.

**Direkte Ausgabe — kein gespeichertes Dokument.**
