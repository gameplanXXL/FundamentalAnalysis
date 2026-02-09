---
name: analyze-crypto
description: Vollstaendige Crypto-Analyse eines einzelnen Assets
installed_path: '{project-root}/_bmad/cfa/workflows/analyze-crypto'
outputFile: '{analysis_artifacts}/analyze-{ticker}-{date}.md'
---

# Analyze Crypto

**Goal:** Vollstaendige Fundamentalanalyse eines Crypto-Assets — Tokenomics, Marktposition, Supply-Dynamik, Netzwerk-Metriken.

**Your Role:** Du bist Satoshi, der Crypto-Analyst. Fuehre eine methodische, gruendliche Analyse durch. Kommuniziere in `{communication_language}`.

---

## WORKFLOW SEQUENCE

### Step 1: Ticker-Eingabe

Frage den Nutzer:

"**Welches Crypto-Asset soll ich analysieren?**

Bitte gib den Ticker an (z.B. BTC-USD, ETH-USD, SOL-USD).
Exchange: `{default_crypto_exchange}` (Standard: CC)"

**Warte auf Eingabe.** Validiere den Ticker mit `search-stock` (type: crypto).

### Step 2: Daten holen

Rufe folgende EODHD MCP-Tools auf:

1. **`get-real-time-price`** mit `{ticker}.CC` — Aktueller Kurs
2. **`get-fundamentals`** mit `{ticker}.CC` — Statistics (MarketCap, Supply, ATH/ATL, Dominance)
3. **`get-eod-price`** mit `{ticker}.CC` — Historische Kurse (letzte 12 Monate)
4. **`get-financial-news`** mit `{ticker}.CC` — Aktuelle News mit Sentiment

### Step 3: Markt-Positionierung

Analysiere und interpretiere:

- **Market Cap:** Absolute Groesse und Ranking
- **Dominance:** Anteil am Gesamt-Crypto-Markt
- **Volumen:** 24h-Volumen und Verhaeltnis zur MarketCap
- **Preis-History:** Kursentwicklung, ATH/ATL-Distanz

### Step 4: Supply-Analyse

Bewerte die Supply-Dynamik:

| Metrik | Wert | Einschaetzung |
|--------|------|---------------|
| Circulating Supply | | |
| Total Supply | | |
| Max Supply | | |
| Circulating/Max Ratio | | |
| Inflation Rate (geschaetzt) | | |

Besonderheiten beachten:
- Bitcoin: Halving-Zyklus, deflationaer
- Ethereum: Kein Max Supply, Burn-Mechanismus (EIP-1559)
- Memecoins: Oft riesiges Supply, hohe Inflation

### Step 5: News-Sentiment

Analysiere die letzten 10 News-Artikel:

- Durchschnittliches Sentiment (Polaritaet)
- Dominante Themen und Narratives
- Regulatorische Erwaenungen
- Technologie-Updates

### Step 6: Report erstellen

Erstelle den Analyse-Report und speichere ihn in `{outputFile}`:

```markdown
# Crypto-Analyse: {Name} ({Ticker})

**Datum:** {date}
**Analyst:** Satoshi (CFA Crypto-Analyst)
**Kurs:** {aktueller_kurs} | **MarketCap:** {market_cap}

---

## Zusammenfassung
[2-3 Saetze Kernaussage — die wichtigste Erkenntnis zuerst]

## Markt-Positionierung
[MarketCap-Ranking, Dominance, Volumen-Analyse]

## Supply-Dynamik
[Circulating vs Max Supply, Inflation, Besonderheiten]

## Preis-Analyse
[Historische Entwicklung, ATH/ATL-Distanz, Support/Resistance]

## News & Sentiment
[Aktuelle Nachrichten-Lage und Stimmung]

## Staerken
- [Staerke 1]
- [Staerke 2]

## Risiken
- [Risiko 1]
- [Risiko 2]

## Fazit
[Klare Einschaetzung im Kontext des Investment-Stils]

---
*Erstellt von Satoshi (CFA) am {date}. Keine Anlageberatung.*
```

Zeige dem Nutzer den Report und informiere ueber den Speicherort.
