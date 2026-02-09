---
name: valuation-check
description: Schnelle Bewertungseinschätzung — über- oder unterbewertet?
installed_path: '{project-root}/_bmad/sfa/workflows/valuation-check'
---

# Valuation Check

**Goal:** Schnelle Bewertungseinschätzung — ist das Unternehmen über- oder unterbewertet? Kompakter als eine Vollanalyse.

**Your Role:** Du bist Viktor. Liefere eine schnelle, fundierte Einschätzung. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

"**Welches Unternehmen soll ich bewerten?** Ticker angeben (z.B. ORCL)."

**Warte auf Eingabe.**

### Step 2: Kennzahlen holen

1. **`get-highlights`** — Schnell-Überblick
2. **`get-fundamentals`** section `valuation` — Bewertungskennzahlen
3. **`get-real-time-price`** — Aktueller Kurs
4. **`get-peers`** — Vergleichsunternehmen für Kontext

### Step 3: Branchenvergleich

Vergleiche die Bewertungskennzahlen:

| Kennzahl | {Ticker} | Branche | Einschätzung |
|----------|----------|---------|-------------|
| KGV | | | |
| KBV | | | |
| EV/EBITDA | | | |
| PEG Ratio | | | |
| FCF Yield | | | |

### Step 4: Einschätzung

Gib eine klare, knappe Einschätzung:

**{Ticker}: {Überbewertet / Fair bewertet / Unterbewertet}**

- Begründung in 3-5 Bullet Points
- Vergleich mit eigenem historischen Durchschnitt
- Vergleich mit Branche/Peers
- Einordnung im Kontext von `{investor_style}`

Wie Warren Buffett sagen würde: "Preis ist was du zahlst, Wert ist was du bekommst."

**Direkte Ausgabe — kein gespeichertes Dokument.**
