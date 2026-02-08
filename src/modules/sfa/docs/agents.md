# Agents Reference

SFA includes 2 specialized agents:

---

## Viktor — Fundamental-Analyst 📊

**ID:** `_bmad/sfa/agents/analyst.md`

**Role:**
Kernanalyst — holt Finanzdaten von EODHD, analysiert Bilanzen, interpretiert Kennzahlen, bewertet Unternehmen und gibt fundierte Einschätzungen.

**When to Use:**
- Du willst ein Unternehmen analysieren
- Du brauchst eine Bewertungseinschätzung
- Du willst mehrere Aktien vergleichen
- Du willst eine Kennzahl erklärt bekommen
- Du brauchst eine Investment-Entscheidung

**Key Capabilities:**
- Vollständige Fundamentalanalyse (Bilanz, GuV, Cashflow)
- Bewertungseinschätzung (KGV, KBV, EV/EBITDA)
- Aktienvergleiche
- Branchenanalyse
- Watchlist-Updates

**Menu Commands:**

| Trigger | Command | Description |
|---------|---------|-------------|
| AS | Analyze Stock | Vollständige Fundamentalanalyse |
| ID | Investment Decision | Kaufentscheidung (mit Rita) |
| CS | Compare Stocks | Vergleich mehrerer Unternehmen |
| VC | Valuation Check | Schnelle Bewertung |
| SA | Sector Analysis | Branchenanalyse |
| WU | Watchlist Update | Watchlist prüfen |
| EM | Explain Metric | Kennzahl erklären |

**Personality:** Ruhig, methodisch, Value-Investor. Zitiert gelegentlich Warren Buffett.

---

## Rita — Risiko-Managerin ⚠️

**ID:** `_bmad/sfa/agents/risk-manager.md`

**Role:**
Spezialistin für Risiken und Red Flags — prüft Schuldenstrukturen, erkennt Warnsignale, erstellt Worst-Case-Szenarien.

**When to Use:**
- Du willst Risiken eines Unternehmens kennen
- Du suchst nach Warnsignalen (Red Flags)
- Du willst wissen, was im schlimmsten Fall passiert
- Ein Freund empfiehlt eine "heiße" Aktie (Gegencheck!)

**Key Capabilities:**
- Vollständige Risikoanalyse
- Red Flag Scan (Insider-Verkäufe, Audit-Wechsel, etc.)
- Stress-Tests (Worst-Case-Szenarien)
- Schuldenanalyse

**Menu Commands:**

| Trigger | Command | Description |
|---------|---------|-------------|
| RA | Risk Assessment | Vollständige Risikoanalyse |
| RF | Red Flag Scan | Schneller Warnsignal-Check |
| ST | Stress Test | Worst-Case-Szenario |
| ID | Investment Decision | Kaufentscheidung (mit Viktor) |

**Personality:** Skeptisch, kritisch, Devil's Advocate. "Trust, but verify."

---

## How They Work Together

Viktor sieht das Potenzial, Rita sieht die Risiken. Beim `Investment Decision` Workflow arbeiten beide zusammen:

1. Viktor analysiert Fundamentaldaten und Bewertung
2. Rita prüft Risiken und Red Flags
3. Gemeinsam entsteht eine ausgewogene Empfehlung
