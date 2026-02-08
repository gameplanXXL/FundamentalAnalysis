# Examples & Use Cases

Praktische Beispiele für die Nutzung von SFA.

---

## Example 1: "Soll ich Oracle kaufen?"

Oracle ist 20% gefallen. Kaufgelegenheit oder Falle?

**Schritt 1:** Starte Viktor
```
/sfa-analyst
```

**Schritt 2:** Investment Decision
```
ID → Oracle
```
Kontext: "Oracle ist 20% gefallen, überlege zu kaufen"

**Ergebnis:** Kombinierter Report von Viktor (Analyse) und Rita (Risiko) mit klarer Empfehlung.

---

## Example 2: Portfolio-Review

Deine Top-5 Positionen vergleichen:

**Schritt 1:** Starte Viktor
```
/sfa-analyst
```

**Schritt 2:** Compare Stocks
```
CS → ORCL, MSFT, GOOGL, AMZN, NVDA
```

**Ergebnis:** Vergleichstabelle mit Kennzahlen und Ranking.

---

## Example 3: Red Flag Check

Ein Freund empfiehlt "XYZ Corp" — du bist skeptisch:

**Schritt 1:** Starte Rita
```
/sfa-risk-manager
```

**Schritt 2:** Red Flag Scan
```
RF → XYZ
```

**Ergebnis:** Liste aller gefundenen Warnsignale.

---

## Example 4: Branchenanalyse

Du interessierst dich für Cloud Computing:

**Schritt 1:** Starte Viktor
```
/sfa-analyst
```

**Schritt 2:** Sector Analysis
```
SA → Cloud Computing
```

**Ergebnis:** Top/Flop Unternehmen der Branche mit Fundamentalvergleich.

---

## Example 5: Stress-Test

Du besitzt Nvidia und machst dir Sorgen wegen der hohen Bewertung:

**Schritt 1:** Starte Rita
```
/sfa-risk-manager
```

**Schritt 2:** Stress Test
```
ST → NVDA
Szenario: "Revenue -30%, KGV-Kompression auf 25"
```

**Ergebnis:** Analyse der Auswirkungen und Überlebensfähigkeit.

---

## Tips & Tricks

- **Ticker-Format:** Nutze das EODHD-Format `SYMBOL.EXCHANGE` (z.B. `ORCL.US`, `SAP.XETRA`). Ohne Exchange wird dein Default aus der Konfiguration verwendet.
- **Schnelle Checks:** Nutze `VC` (Valuation Check) und `RF` (Red Flag Scan) für schnelle Einschätzungen ohne vollständige Analyse.
- **Kombiniert:** Starte mit `AS` (Analyze Stock) bei Viktor, dann wechsle zu Rita für `RA` (Risk Assessment).
- **Kennzahlen:** Wenn du eine Kennzahl nicht verstehst, frage Viktor mit `EM` (Explain Metric).

---

## Troubleshooting

### "EODHD API Fehler"
- Prüfe ob `EODHD_API_KEY` in `.env` gesetzt ist
- Prüfe ob der MCP-Server läuft (`make start`)
- Prüfe dein API-Kontingent auf eodhd.com

### "Ticker nicht gefunden"
- Nutze das Format `SYMBOL.EXCHANGE` (z.B. `SAP.XETRA`)
- Nutze `search-stock` um den richtigen Ticker zu finden

### "Keine Daten verfügbar"
- Nicht alle Unternehmen haben vollständige Fundamentaldaten bei EODHD
- Versuche eine andere Exchange (z.B. `.US` statt `.XETRA`)

---

## Getting More Help

- Frage Viktor oder Rita direkt im Chat (`CH`)
- Prüfe deine Modul-Konfiguration
- Konsultiere die EODHD API-Dokumentation
