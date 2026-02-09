---
name: crypto-decision
description: BUY/HOLD/SELL Empfehlung fuer ein Crypto-Asset
installed_path: '{project-root}/_bmad/cfa/workflows/crypto-decision'
outputFile: '{analysis_artifacts}/decisions/decision-{ticker}-{date}.md'
---

# Crypto Decision

**Goal:** Kombinierte BUY/HOLD/SELL-Empfehlung fuer ein Crypto-Asset — von Satoshi analysiert, von Cassandra risiko-geprueft.

**Your Role:** Du fuehrst beide Perspektiven zusammen. Kommuniziere in `{communication_language}`.

---

## MARKDOWN-FORMATIERUNG IM REPORT

**KRITISCH:** Verwende NIEMALS das `$`-Zeichen (Dollarzeichen) im Fliesstext oder in Bold-Markierungen. Viele Markdown-Renderer (GitHub, Obsidian, etc.) interpretieren `$...$` als LaTeX-Math-Delimiter, was Bold/Italic-Formatierung zerstoert.

- **Falsch:** `Der Kurs von **$142.82** liegt unter dem Fair Value von $277.00`
- **Richtig:** `Der Kurs von **142.82 USD** liegt unter dem Fair Value von 277.00 USD`
- **In Tabellenzellen** sind Dollarzeichen erlaubt — dort tritt das Problem nicht auf.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

Frage den Nutzer:

"**Fuer welches Crypto-Asset soll ich eine Entscheidung treffen?**

Bitte gib den Ticker an (z.B. BTC-USD, ETH-USD, SOL-USD)."

**Warte auf Eingabe.** Validiere den Ticker.

### Step 2: Satoshis Analyse

Fuehre als Satoshi die Analyse durch:

1. Hole Marktdaten (Kurs, MarketCap, Supply, ATH/ATL)
2. Bewerte Tokenomics und Supply-Dynamik
3. Analysiere News-Sentiment
4. Bestimme Markt-Positionierung
5. Gib eine vorlaefige Einschaetzung ab

### Step 3: Cassandras Risiko-Pruefung

Wechsle zu Cassandras Perspektive:

1. **Custodial-Risk:** Wo wird das Asset typischerweise verwahrt?
2. **Regulatorisches Risiko:** SEC-Einstufung, Gesetzgebung, Verbote
3. **Technologie-Risiko:** Smart-Contract-Bugs, Netzwerk-Ausfaelle
4. **Konzentrations-Risiko:** Whale-Wallets, Team-Token-Unlocks
5. **Markt-Risiko:** Korrelation zu BTC, Liquiditaet, Volatilitaet

### Step 4: Kombinierte Entscheidung

Bringe beide Perspektiven zusammen:

**Entscheidungs-Matrix:**

| Faktor | Gewichtung | Satoshi | Cassandra | Score |
|--------|-----------|---------|-----------|-------|
| Tokenomics | 25% | | | |
| Markt-Position | 20% | | | |
| Supply-Dynamik | 20% | | | |
| Risiko-Profil | 20% | | | |
| News/Sentiment | 15% | | | |

**Empfehlung:** BUY / HOLD / SELL mit Begruendung

### Step 5: Report erstellen

```markdown
# Crypto-Entscheidung: {Name} ({Ticker})

**Datum:** {date}
**Analysten:** Satoshi + Cassandra (CFA)
**Empfehlung:** {BUY/HOLD/SELL}

---

## Satoshis Einschaetzung
[Analyse-Zusammenfassung]

## Cassandras Risiko-Warnung
[Risiko-Zusammenfassung]

## Entscheidungs-Matrix
[Tabelle mit Scoring]

## Empfehlung
[Klare Empfehlung mit Begruendung und Konditionen]

## Watchlist-Trigger
[Konkrete Werte, bei denen die Einschaetzung sich aendern wuerde]

---
*Erstellt von Satoshi & Cassandra (CFA) am {date}. Keine Anlageberatung.*
```
