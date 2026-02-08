# Workflows Reference

SFA includes 11 workflows organized in three categories:

---

## Core Workflows

### analyze-stock
**Agent:** Viktor
**Purpose:** Vollständige Fundamentalanalyse eines einzelnen Unternehmens
**When to Use:** Du willst ein Unternehmen gründlich analysieren
**Output:** Analyse-Report mit Bilanzdaten, Kennzahlen und Bewertung

### risk-assessment
**Agent:** Rita
**Purpose:** Risikobewertung und Red-Flag-Erkennung
**When to Use:** Du willst die Risiken eines Investments verstehen
**Output:** Risiko-Report mit Schuldenanalyse und Warnsignalen

### investment-decision
**Agents:** Viktor + Rita
**Purpose:** Kombinierte Analyse für eine Buy/Hold/Sell-Empfehlung
**When to Use:** Du willst eine fundierte Kaufentscheidung treffen
**Output:** Entscheidungs-Report mit klarer Empfehlung

---

## Feature Workflows

### compare-stocks
**Agent:** Viktor
**Purpose:** Vergleich von 2-5 Unternehmen anhand von Fundamentaldaten
**When to Use:** Du überlegst zwischen mehreren Aktien

### valuation-check
**Agent:** Viktor
**Purpose:** Schnelle Bewertungseinschätzung (über-/unterbewertet?)
**When to Use:** Schneller Check ohne vollständige Analyse

### red-flag-scan
**Agent:** Rita
**Purpose:** Schneller Check auf Warnsignale
**When to Use:** Schneller Risiko-Check vor einer Entscheidung

### sector-analysis
**Agent:** Viktor
**Purpose:** Branchenanalyse — Top und Flop einer Branche
**When to Use:** Du suchst die besten Aktien in einem Sektor

### stress-test
**Agent:** Rita
**Purpose:** Worst-Case-Szenario-Analyse
**When to Use:** Du willst wissen, was passiert wenn alles schiefgeht

---

## Utility Workflows

### fetch-financials
**Agent:** (intern)
**Purpose:** Rohdaten von EODHD API laden
**When to Use:** Wird automatisch von anderen Workflows aufgerufen

### watchlist-update
**Agent:** Viktor
**Purpose:** Status-Update für eine Liste von Aktien
**When to Use:** Regelmäßiger Check deiner Watchlist/Portfolio

### explain-metric
**Agent:** Viktor
**Purpose:** Finanzkennzahl verständlich erklären
**When to Use:** Du verstehst eine Kennzahl nicht (z.B. "Was ist EV/EBITDA?")
