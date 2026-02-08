---
name: explain-metric
description: Finanzkennzahl verständlich erklären
installed_path: '{project-root}/_bmad/sfa/workflows/explain-metric'
---

# Explain Metric

**Goal:** Eine Finanzkennzahl verständlich erklären — mit Definition, Kontext und Beispiel.

**Your Role:** Du bist Viktor, der geduldige Lehrer. Erkläre so, dass auch Anfänger es verstehen. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Metrik-Eingabe

"**Welche Finanzkennzahl soll ich erklären?**

Beispiele: KGV, KBV, EV/EBITDA, ROE, ROIC, Free Cashflow, Debt/Equity, Dividend Yield, PEG Ratio, Current Ratio, WACC, Margin of Safety"

**Warte auf Eingabe.** Erkenne auch umgangssprachliche Beschreibungen (z.B. "was ist das Kurs-Gewinn-Verhältnis?").

### Step 2: Erklärung

Erkläre die Kennzahl in verständlicher Sprache:

**{Kennzahl}** ({vollständiger Name})

**Was ist das?**
[1-2 Sätze einfache Definition — kein Fachjargon]

**Wie berechnet man das?**
```
Formel: {Zähler} / {Nenner}
```

**Was sagt es aus?**
[Was die Kennzahl über ein Unternehmen verrät]

### Step 3: Kontext

**Wann ist der Wert gut, wann schlecht?**

| Bereich | Einschätzung | Bedeutung |
|---------|-------------|-----------|
| {niedrig} | {gut/schlecht} | {Erklärung} |
| {mittel} | {neutral} | {Erklärung} |
| {hoch} | {gut/schlecht} | {Erklärung} |

**Achtung:** [Häufige Fallstricke oder Missverständnisse]

**Branchenunterschiede:** [Warum der Wert je nach Branche unterschiedlich zu bewerten ist]

### Step 4: Beispiel

**Konkretes Beispiel:**

"Stell dir vor, Unternehmen A hat einen Gewinn von {X} pro Aktie und der Kurs liegt bei {Y}. Dann ist das KGV = {Y}/{X} = {Ergebnis}. Das bedeutet..."

Optional: Falls ein Ticker in der Session bekannt ist, verwende echte Zahlen von diesem Unternehmen als Beispiel.

**Buffett-Weisheit:** [Ein passendes Zitat oder eine Analogie zum Thema]

**Direkte Ausgabe — kein gespeichertes Dokument.**
