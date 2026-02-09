---
name: investment-decision
description: Kombinierte Analyse für Kaufentscheidung (Buy/Hold/Sell)
installed_path: '{project-root}/_bmad/sfa/workflows/investment-decision'
outputFile: '{analysis_artifacts}/decisions/decision-{ticker}-{date}.md'
---

# Investment Decision

**Goal:** Kombinierte Buy/Hold/Sell-Empfehlung basierend auf Fundamentalanalyse UND Risikobewertung.

**Your Role:** Viktor orchestriert — führe zuerst die Fundamentalanalyse durch, dann wechsle in Ritas Perspektive für die Risikobewertung. Kombiniere beide Sichtweisen zu einer klaren Empfehlung. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker & Kontext

"**Für welches Unternehmen brauchst du eine Kaufentscheidung?**

Ticker angeben (z.B. ORCL, MSFT). Börse: `{default_exchange}`

Optional: Warum interessiert dich diese Aktie? (z.B. '20% gefallen', 'Dividenden-Kandidat')"

**Warte auf Eingabe.** Validiere mit `search-stock`.

### Step 2: Fundamentalanalyse (Viktor-Perspektive)

Führe eine kompakte Fundamentalanalyse durch:

1. **`get-fundamentals`** sections: highlights, valuation, balance-sheet-quarterly, income-statement-quarterly, cash-flow-quarterly
2. **`get-eod-price`** — 12 Monate Kurshistorie
3. **`get-real-time-price`** — Aktueller Kurs
4. **`get-peers`** — Vergleichsunternehmen

Erstelle eine Zusammenfassung:
- Qualität des Unternehmens (Margen, Wachstum, Cashflow)
- Bewertung (KGV, EV/EBITDA vs. Peers und Historie)
- Stärken identifizieren

### Step 3: Risikobewertung (Rita-Perspektive)

Wechsle in Ritas skeptische Perspektive:

1. **`get-insider-transactions`** — Insider-Aktivität
2. **`get-financial-news`** — Aktuelle Risiko-Nachrichten

Prüfe:
- Schuldenstruktur und Verschuldungsgrad
- Red Flags (Insider-Verkäufe, Margin-Verfall, Cashflow-Probleme)
- Negative Trends
- Branchenrisiken

### Step 4: Moat Scorecard

Bewerte den Wettbewerbsvorteil (Moat) des Unternehmens auf 5 Dimensionen (je 0-10):

| Dimension | Score | Begründung |
|-----------|-------|------------|
| **Switching Costs** | /10 | Wie schwer ist es fuer Kunden zu wechseln? (Lock-in, Migration, Oekosystem) |
| **Network Effects** | /10 | Wird das Produkt besser mit mehr Nutzern? (Plattform, Marketplace, Daten) |
| **Cost Advantage** | /10 | Kann das Unternehmen guenstiger produzieren? (Skaleneffekte, Technologie) |
| **Intangible Assets** | /10 | Patente, Marken, regulatorische Lizenzen, Daten-Assets |
| **Efficient Scale** | /10 | Natuerliches Monopol/Oligopol? Eintrittsbarrieren? |
| **Moat Score** | /50 | Summe |

**Moat Grade:** A (40+) / B (30-39) / C (20-29) / D (10-19) / F (<10)
**Moat Trend:** WIDENING (wird breiter) / STABLE / NARROWING (wird schmaler)

Identifiziere ausserdem:
- **Moat Threats:** Was koennte den Burggraben schmaelern? (Wettbewerber, Technologie, Regulierung)
- **Moat Catalysts:** Was koennte den Burggraben verbreitern?

Pruefe die `competitive_map` in `{project-root}/config/watchlist.yaml` — gibt es Cross-Stock-Abhaengigkeiten, die den Moat beeinflussen?

Speichere/aktualisiere die Scorecard in `{project-root}/config/moat-scorecards.yaml`.

### Step 5: Synthese

Kombiniere Viktors und Ritas Perspektiven:

| Aspekt | Viktor (Chance) | Rita (Risiko) |
|--------|----------------|---------------|
| Qualität | | |
| Bewertung | | |
| Wachstum | | |
| Bilanz | | |
| Moat | | |
| Strategie | | |

**Abwägung:** Überwiegen die Chancen oder die Risiken? Berücksichtige insbesondere den Moat Trend — ein NARROWING Moat bei hoher Bewertung ist ein starkes Verkaufssignal.

### Step 6: Empfehlung

Berücksichtige den Investor-Stil `{investor_style}`:

- **Value:** Fokus auf Unterbewertung und Margin of Safety
- **Growth:** Fokus auf Wachstumspotenzial und Marktposition
- **Dividend:** Fokus auf Dividendensicherheit und Yield
- **Balanced:** Ausgewogene Betrachtung aller Faktoren

Gib eine klare Empfehlung:
- **BUY** — Klarer Kaufkandidat mit akzeptablem Risiko
- **HOLD** — Bestehendes Investment halten, aber nicht aufstocken
- **SELL** — Risiken überwiegen, Position reduzieren
- **WATCH** — Interessant, aber Timing noch nicht ideal

### Step 7: Decision-Report

Erstelle und speichere in `{outputFile}`:

```markdown
# Investment-Entscheidung: {Unternehmensname} ({Ticker})

**Datum:** {date}
**Empfehlung:** {BUY / HOLD / SELL / WATCH} {emoji}
**Investor-Stil:** {investor_style}
**Kurs:** {aktueller_kurs}

---

## Zusammenfassung
[Die Kernaussage in 2-3 Sätzen]

## Viktor sagt (Chancen)
[Fundamentale Stärken und Bewertung]

## Rita sagt (Risiken)
[Identifizierte Risiken und Red Flags]

## Moat Scorecard

| Dimension | Score | Begründung |
|-----------|-------|------------|
| Switching Costs | /10 | |
| Network Effects | /10 | |
| Cost Advantage | /10 | |
| Intangible Assets | /10 | |
| Efficient Scale | /10 | |
| **Moat Score** | **/50** | **Grade: _ | Trend: _** |

**Threats:** [Was den Moat bedroht]
**Catalysts:** [Was den Moat staerkt]

## Synthese
[Chance-Risiko-Abwägung Tabelle inkl. Moat und Strategie]

## Empfehlung: {BUY/HOLD/SELL/WATCH}
[Detaillierte Begründung im Kontext des Investor-Stils und Moat-Bewertung]

## Bedingungen
- Kaufen wenn: [Bedingung]
- Verkaufen wenn: [Bedingung]
- Beobachten: [Was sich ändern müsste]

---
*Erstellt von Viktor & Rita (SFA) am {date}. Keine Anlageberatung.*
```

### Step 8: Watchlist-Trigger vorschlagen

Basierend auf den Bedingungen aus Step 7, schlage passende Trigger fuer `config/watchlist.yaml` vor.

Lies zuerst die aktuelle `{project-root}/config/watchlist.yaml`. Dann generiere YAML-Trigger basierend auf den definierten Bedingungen:

- **Kaufbedingungen** → `price_triggers` mit `action: "BUY"` oder `fundamental_triggers` mit passendem Metrik-Mapping
- **Verkaufbedingungen** → Trigger mit `action: "SELL"`
- **Beobachtungsbedingungen** → Trigger mit `action: "REVIEW"` oder `action: "WATCH"`

Verfuegbare Metriken: `operating_margin`, `fcf`, `net_debt`, `revenue_growth_yoy`, `earnings_growth_yoy`, `pe_ratio`, `dividend_yield`, `current_ratio`, `debt_equity`, `insider_net_sells`

Zeige den Vorschlag als YAML-Block und frage:
"**Soll ich diese Trigger in die Watchlist uebernehmen?** (ja/nein/anpassen)"

Bei "ja": Fuege die Trigger in `config/watchlist.yaml` ein (oder aktualisiere bestehende Eintraege fuer den Ticker).
Bei "anpassen": Lass den Nutzer die Werte aendern und uebernimm dann.
