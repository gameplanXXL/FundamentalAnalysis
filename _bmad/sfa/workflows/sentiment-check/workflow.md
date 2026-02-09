---
name: sentiment-check
description: Umfassende Sentiment-Analyse — News, Analysten, Insider, Marktstimmung
installed_path: '{project-root}/_bmad/sfa/workflows/sentiment-check'
---

# Sentiment Check

**Goal:** Umfassende Marktstimmungs-Analyse fuer ein Unternehmen — News-Sentiment, Analysten-Konsens, Insider-Aktivitaet und Markt-Indikatoren in einem gewichteten Gesamt-Score.

**Your Role:** Du bist Viktor. Liefere eine datengetriebene Sentiment-Analyse. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

"**Welches Unternehmen soll ich auf Marktstimmung analysieren?** Ticker angeben (z.B. ORCL)."

**Warte auf Eingabe.**

### Step 2: News-Sentiment holen

1. **`get-financial-news`** mit ticker={TICKER}.US, limit=20
2. Berechne den Durchschnitt der `sentiment.polarity` aller Artikel
3. Identifiziere die **3 positivsten** und **3 negativsten** Artikel (nach Polarity sortiert)
4. Fasse die dominierenden Themen zusammen

Bewertung (0-10 Skala):
- Polarity > 0.3: Score 8-10 (sehr positiv)
- Polarity 0.1-0.3: Score 6-8 (positiv)
- Polarity -0.1 bis 0.1: Score 4-6 (neutral)
- Polarity -0.3 bis -0.1: Score 2-4 (negativ)
- Polarity < -0.3: Score 0-2 (sehr negativ)

### Step 3: Analysten-Ratings holen

1. **`get-fundamentals`** mit ticker={TICKER}, section=analyst-ratings
2. **`get-real-time-price`** mit ticker={TICKER}.US
3. Extrahiere: Rating (1-5), TargetPrice, StrongBuy/Buy/Hold/Sell/StrongSell Verteilung
4. Berechne: `((TargetPrice - Kurs) / Kurs) * 100` = Upside/Downside %

Rating-Score (0-10 Skala):
- Rating >= 4.5: Score 9-10
- Rating 4.0-4.5: Score 7-9
- Rating 3.5-4.0: Score 5-7
- Rating 3.0-3.5: Score 3-5
- Rating < 3.0: Score 0-3

Kursziel-Score (0-10 Skala):
- Upside > 30%: Score 9-10
- Upside 15-30%: Score 7-9
- Upside 0-15%: Score 5-7
- Downside 0-15%: Score 3-5
- Downside > 15%: Score 0-3

### Step 4: Insider-Aktivitaet holen

1. **`get-insider-transactions`** mit ticker={TICKER}.US, limit=50
2. Filtere auf die letzten 3 Monate
3. Zaehle: Corporate Sells, Corporate Buys, Congress Sells, Congress Buys
4. Berechne Net Buy/Sell Ratio

Insider-Score (0-10 Skala):
- Deutliche Netto-Kaeufe (>5): Score 8-10
- Leichte Netto-Kaeufe (1-5): Score 6-8
- Ausgeglichen: Score 4-6
- Leichte Netto-Verkaeufe (1-5): Score 2-4
- Deutliche Netto-Verkaeufe (>5): Score 0-2

Bonus: Congress-Kaeufe erhoehen den Score um +1 (max 10).

### Step 5: Markt-Stimmung

1. **`get-real-time-price`** mit ticker=VIX.INDX — VIX-Level

VIX-Score (0-10 Skala):
- VIX < 15: Score 8-10 (niedrige Volatilitaet, Bullenmarkt)
- VIX 15-20: Score 6-8 (normal)
- VIX 20-25: Score 4-6 (erhoehte Unsicherheit)
- VIX 25-30: Score 2-4 (hohe Angst)
- VIX > 30: Score 0-2 (Panik)

### Step 6: Gewichtete Synthese

Berechne den **Gesamt-Sentiment-Score** mit folgender Gewichtung:

| Komponente | Gewicht | Score |
|------------|---------|-------|
| News-Sentiment | 20% | {news_score}/10 |
| Analysten-Rating | 30% | {rating_score}/10 |
| Analysten-Kursziel | 20% | {target_score}/10 |
| Insider-Aktivitaet | 20% | {insider_score}/10 |
| Markt-Stimmung (VIX) | 10% | {vix_score}/10 |
| **Gesamt** | **100%** | **{total}/10** |

Interpretation:
- **8-10:** Sehr bullisch — Markt und Analysten sind stark positiv
- **6-8:** Bullisch — ueberwiegend positive Signale
- **4-6:** Neutral — gemischte Signale, abwarten
- **2-4:** Baerisch — ueberwiegend negative Signale
- **0-2:** Sehr baerisch — starke Warnsignale

### Step 7: Report erstellen

Erstelle den Report und speichere ihn als:
`{analysis_artifacts}/sentiment/sentiment-{TICKER}-{YYYY-MM-DD}.md`

Wobei `{analysis_artifacts}` = `_bmad-output/stocks` ist.

**Report-Struktur:**

```markdown
# Sentiment-Analyse: {TICKER} — {Name}

> Erstellt am {Datum} | Gesamt-Score: **{total}/10** ({Interpretation})

## Zusammenfassung

{2-3 Saetze: Gesamtbild der Marktstimmung}

## 1. News-Sentiment (Score: {score}/10, Gewicht: 20%)

- **Durchschnittliche Polarity:** {value}
- **Analysierte Artikel:** {count}
- **Dominierendes Thema:** {theme}

### Positivste Nachrichten
| Datum | Titel | Polarity |
|-------|-------|----------|
| ... | ... | ... |

### Negativste Nachrichten
| Datum | Titel | Polarity |
|-------|-------|----------|
| ... | ... | ... |

## 2. Analysten-Konsens (Score: {score}/10, Gewicht: 30%)

- **Rating:** {rating}/5
- **Verteilung:** StrongBuy: {n}, Buy: {n}, Hold: {n}, Sell: {n}, StrongSell: {n}
- **Kursziel:** {target} USD (aktueller Kurs: {price} USD)
- **Upside/Downside:** {pct}%

## 3. Kursziel-Analyse (Score: {score}/10, Gewicht: 20%)

{Einordnung des Kursziels im Kontext}

## 4. Insider-Aktivitaet (Score: {score}/10, Gewicht: 20%)

- **Zeitraum:** Letzte 3 Monate
- **Corporate Buys:** {n} | **Corporate Sells:** {n}
- **Congress Buys:** {n} | **Congress Sells:** {n}
- **Netto:** {net_description}

## 5. Markt-Stimmung (Score: {score}/10, Gewicht: 10%)

- **VIX:** {value}
- **Einordnung:** {interpretation}

## Gesamt-Score

| Komponente | Gewicht | Score | Gewichtet |
|------------|---------|-------|-----------|
| News-Sentiment | 20% | {}/10 | {} |
| Analysten-Rating | 30% | {}/10 | {} |
| Kursziel | 20% | {}/10 | {} |
| Insider | 20% | {}/10 | {} |
| VIX | 10% | {}/10 | {} |
| **Gesamt** | **100%** | | **{total}/10** |

## Handlungsempfehlung

{Basierend auf dem Gesamt-Score: Klare Empfehlung}
```
