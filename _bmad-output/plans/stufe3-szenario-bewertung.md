# Plan: Stufe 3 — Szenario-basierte Bewertung

**Datum:** 2026-02-09
**Status:** PLAN (nicht implementiert)
**Abhaengig von:** Stufe 1 (Competitive Map) + Stufe 2 (Moat Scorecard) — implementiert

---

## Ziel

Statt einer einzelnen Empfehlung (BUY/SELL) soll jede Investment Decision drei gewichtete Szenarien mit Fair-Value-Berechnung liefern:

| Szenario | Wahrscheinlichkeit | Fair Value | Beschreibung |
|----------|-------------------|------------|-------------|
| Bull | 25% | $X | Alles laeuft optimal |
| Base | 50% | $Y | Erwartetes Szenario |
| Bear | 25% | $Z | Risiken materialisieren sich |
| **Gewichteter Fair Value** | | **$W** | Summe(P * FV) |

**Margin of Safety** = (Gewichteter FV - Aktueller Kurs) / Gewichteter FV

---

## Architektur-Entscheidung: Bewertungsmethode

### Option A: Multiples-basiert (empfohlen fuer V1)

Fair Value = Earnings * Ziel-KGV (oder Revenue * Ziel-EV/Revenue)

**Vorteile:**
- Einfach mit vorhandenen EODHD-Daten umsetzbar
- Keine DCF-Modell-Komplexitaet
- Peer-Vergleich als Ankerpunkt

**Beispiel NVDA:**
- Bull: EPS $8,50 * KGV 35 = $298
- Base: EPS $7,50 * KGV 28 = $210
- Bear: EPS $5,50 * KGV 20 = $110
- Gewichtet: $298*0.25 + $210*0.50 + $110*0.25 = $207
- Aktueller Kurs: $185 → Margin of Safety: +12% → BUY bestaetigt

### Option B: DCF-Modell (Stufe 3b — spaeter)

Discounted Cash Flow mit verschiedenen Wachstumsraten und WACC-Annahmen.

**Vorteile:**
- Fundamentalere Bewertung
- Unabhaengig von Markt-Multiples

**Nachteile:**
- Erfordert Annahmen fuer WACC, Terminal Growth, CapEx-Entwicklung
- "Garbage in, garbage out" — hohe Fehleranfaelligkeit
- Nicht mit EODHD allein umsetzbar (braucht Yield-Kurven, Beta-Daten)

### Empfehlung: Option A zuerst, Option B als Erweiterung

---

## Implementierungsplan

### 1. Neuer Workflow: `scenario-valuation`

**Pfad:** `_bmad/sfa/workflows/scenario-valuation/workflow.md`

**Steps:**
1. Ticker & aktuellen Kurs laden
2. Fundamentaldaten abrufen (Earnings, Revenue, FCF, Peers)
3. Moat Scorecard aus `config/moat-scorecards.yaml` laden
4. Competitive Map pruefen — strategische Risiken/Chancen identifizieren
5. Drei Szenarien definieren (basierend auf Moat Trend + Strategic Triggers):
   - **Bull:** Moat WIDENING, Wachstum beschleunigt, keine strategischen Risiken
   - **Base:** Moat STABLE, Wachstum wie erwartet, moderate Risiken
   - **Bear:** Moat NARROWING, strategische Risiken materialisieren sich
6. Fuer jedes Szenario:
   - Forward-EPS schaetzen (basierend auf Analyst-Konsens + Anpassung)
   - Ziel-Multiple bestimmen (basierend auf Moat Grade + Wachstum)
   - Fair Value = EPS * Ziel-KGV
7. Gewichteten Fair Value berechnen
8. Margin of Safety bestimmen
9. Report speichern

### 2. Integration in Investment Decision

Der bestehende `investment-decision` Workflow bekommt einen **optionalen** Step 8b:

```
### Step 8b: Szenario-Bewertung (optional)

Falls der Nutzer eine quantitative Bewertung wuenscht, fuehre den
`scenario-valuation` Workflow inline aus. Zeige:

- Bull/Base/Bear Fair Values
- Gewichteter Fair Value vs. aktueller Kurs
- Margin of Safety in %
```

### 3. Report-Erweiterung

Neues Section im Decision-Report:

```markdown
## Szenario-Bewertung

| Szenario | P | EPS (Fwd) | Ziel-KGV | Fair Value |
|----------|---|-----------|----------|------------|
| Bull     | 25% | $X     | Y        | $Z         |
| Base     | 50% | $X     | Y        | $Z         |
| Bear     | 25% | $X     | Y        | $Z         |
| **Gewichtet** | | | | **$W** |

**Aktueller Kurs:** $K
**Margin of Safety:** +/- X%
**Bewertung:** Unterbewertet / Fair / Ueberbewertet
```

### 4. Szenario-Treiber aus Competitive Map

Die Szenarien werden NICHT willkuerlich definiert, sondern durch die Competitive Map und Moat Scorecard informiert:

| Treiber | Bull | Base | Bear |
|---------|------|------|------|
| Moat Trend | WIDENING | STABLE | NARROWING |
| Strategic Triggers | Positiv (z.B. TPU-Skalierung fuer AVGO) | Neutral | Negativ (z.B. Custom ASICs ersetzen GPUs) |
| Earnings Growth | Oberhalb Konsens | Konsens | Unterhalb Konsens |
| Multiple-Expansion | Ja (Markt erkennt Moat) | Stabil | Kompression (Wettbewerb/Risiko) |

### 5. Datenquellen-Anforderungen

**Bereits verfuegbar (EODHD):**
- Forward-EPS (aus `get-fundamentals` → highlights → ForwardEPS)
- Analyst-Target (WallStreetTargetPrice)
- Trailing-Multiples (PERatio, PEGRatio, ForwardPE)
- Peer-Multiples (via `get-peers` + `get-fundamentals`)
- Revenue/Earnings Growth Rates

**Zusaetzlich benoetigt (siehe Datenquellen-Analyse):**
- Analyst-Konsens-EPS fuer 2-3 Jahre voraus (EODHD hat nur 1 Jahr Forward)
- Historische Multiple-Ranges (5-Jahres-KGV-Band)
- Branchenspezifische Multiples als Benchmark

### 6. Config-Erweiterung

Neue Datei `config/valuation-params.yaml`:

```yaml
version: 1

# Default-Wahrscheinlichkeiten
default_probabilities:
  bull: 0.25
  base: 0.50
  bear: 0.25

# Multiple-Ranges nach Moat Grade
multiple_ranges:
  A:  # Moat Score 40+
    pe_range: [25, 35]     # Base-KGV-Range
    premium: 1.2           # 20% Premium auf Branche
  B:  # Moat Score 30-39
    pe_range: [20, 30]
    premium: 1.0
  C:  # Moat Score 20-29
    pe_range: [15, 25]
    premium: 0.8
  D:  # Moat Score 10-19
    pe_range: [10, 20]
    premium: 0.6

# Wachstums-Anpassung
growth_adjustment:
  high_growth: 1.3     # >30% Revenue Growth → 30% Multiple-Premium
  moderate_growth: 1.0  # 10-30%
  low_growth: 0.7      # <10%
  declining: 0.5       # Negativ
```

---

## Abhaengigkeiten und Reihenfolge

1. [x] Stufe 1: Competitive Map (implementiert)
2. [x] Stufe 2: Moat Scorecard (implementiert)
3. [ ] `config/valuation-params.yaml` erstellen
4. [ ] `_bmad/sfa/workflows/scenario-valuation/workflow.md` erstellen
5. [ ] Investment Decision Workflow um optionalen Step 8b erweitern
6. [ ] Report-Template erweitern
7. [ ] Testlauf mit NVDA (da am besten analysiert)
8. [ ] Alle 10 Watchlist-Aktien durchrechnen

---

## Offene Fragen

1. **Sollen die Wahrscheinlichkeiten pro Aktie anpassbar sein?** (z.B. TSLA Bear wahrscheinlicher als NVDA Bear)
2. **Soll der Bear-Case den Stress-Test-Workflow integrieren?** (Resilienz + Bewertung kombinieren)
3. **Wie oft aktualisieren?** Nach jedem Earnings-Report? Quartalsweise?

---
*Plan erstellt am 2026-02-09 von Viktor (SFA).*
