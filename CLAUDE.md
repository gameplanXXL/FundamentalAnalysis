# CLAUDE.md - FundamentalAnalysis

## Projektbeschreibung

FundamentalAnalysis ist ein Projekt, das mit dem BMAD-Framework (v6.0.0-Beta.7) aufgebaut wird.
Die Planung und Entwicklung wird KI-gestützt über spezialisierte Agenten und Workflows orchestriert.

## Kritische Regeln

### 1. IMMER committen und pushen

**Alle Änderungen MÜSSEN sofort committed und gepusht werden.**

- Nach jeder abgeschlossenen Änderung: `git add`, `git commit`, `git push`
- Keine Änderungen dürfen nur lokal verbleiben
- Commit-Messages müssen aussagekräftig sein und beschreiben, WAS und WARUM geändert wurde
- Vor dem Beginn neuer Arbeiten: `git pull` ausführen, um auf dem aktuellen Stand zu sein
- Feature-Branches verwenden und über Pull Requests mergen

### 2. Datenbank-Änderungen NUR über Migrationen

**Alle Datenbank-Änderungen MÜSSEN über Datenbank-Migrationen erfolgen. Direkte Schema-Änderungen an der Datenbank sind strikt verboten.**

- Jede Schema-Änderung (Tabellen, Spalten, Indizes, Constraints) erfordert eine Migration
- Migrationen müssen idempotent und reversibel sein (up + down)
- Migrationen werden versioniert und in der Versionskontrolle (Git) eingecheckt
- Keine manuellen SQL-Änderungen direkt auf der Datenbank ausführen
- Seed-Daten ebenfalls über Migrationen oder dedizierte Seed-Skripte verwalten
- Vor dem Deployment: Sicherstellen, dass alle Migrationen in der richtigen Reihenfolge ausgeführt werden

## Projektstruktur

```
fundamental/
├── _bmad/              # BMAD-Framework (Agenten, Workflows, Tasks, Config)
├── _bmad-output/       # Generierte Artefakte (Planung, Implementierung)
├── .claude/            # Claude Code Integration und Commands
├── .opencode/          # OpenCode Integration und Commands
├── .env                # Umgebungsvariablen (NICHT committen!)
├── CLAUDE.md           # Diese Datei - Projektrichtlinien
└── README.md           # Projektbeschreibung
```

## Umgebung

- **Sprache:** Deutsch (Kommunikation und Dokumentation)
- **BMAD-Version:** 6.0.0-Beta.7
- **Konfiguration:** `_bmad/core/config.yaml`

## Git-Konventionen

- Commit-Messages auf Deutsch oder Englisch (konsistent bleiben)
- `.env` ist in `.gitignore` und darf NIEMALS committed werden
- Generierte Artefakte in `_bmad-output/` nach Bedarf committen

## Wichtige Hinweise

- BMAD-Agenten und Workflows befinden sich unter `_bmad/`
- Ausgaben werden in `_bmad-output/` abgelegt
- Bei Fragen zum Workflow: `/bmad-help` verwenden
