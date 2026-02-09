# Tokenomics: Ethereum (ETH-USD)

**Datum:** 2026-02-09
**Analyst:** Satoshi (CFA)

---

## Supply-Dashboard

| Metrik | Wert | Einschaetzung |
|--------|------|---------------|
| **Circulating Supply** | 120.692.627 ETH | Gesamtes Supply im Umlauf |
| **Total Supply** | 120.692.627 ETH | Identisch mit Circulating |
| **Max Supply** | **Kein Limit** | Kein Hard Cap — Emission laeuft ewig |
| **Staking-Quote** | ~30% (ATH) | ~36 Mio. ETH gebunden |
| **Frei handelbar** | ~84,5 Mio. ETH | 70% des Supplies |
| **Inflation Rate (netto)** | ~0% bis leicht deflationaer | EIP-1559 Burn vs. Staking Rewards |
| **Aktueller Kurs** | 2.042 USD | -59% vom ATH (4.954 USD) |
| **Market Cap** | ~246 Mrd. USD | #2 Crypto |
| **Fully Diluted Valuation** | ~246 Mrd. USD | Identisch mit MCap (kein Max Supply) |
| **FDV/MCap Ratio** | 1,00x | Kein Lockup-Effekt |

## Mechanik

### Dual-Mechanismus: Emission + Burn

Ethereum hat seit dem Merge (Sep 2022) und EIP-1559 (Aug 2021) ein einzigartiges Dual-System:

**1. Emission (inflationaer):**
- Staking Rewards: ~0,5-1,0% p.a. des Total Supply
- Abhaengig von der Anzahl Validatoren und gestaktem ETH
- Aktuell ~1.700 ETH/Tag neue Emission

**2. Burn (deflationaer):**
- EIP-1559: Base Fee jeder Transaktion wird verbrannt (destroyed)
- Bei hoher Netzwerkaktivitaet > Burn > Emission = **netto deflationaer**
- Bei niedriger Aktivitaet: Emission > Burn = **netto inflationaer**

| Szenario | Emission/Tag | Burn/Tag | Netto/Tag | Jaehrl. Inflation |
|----------|-------------|----------|-----------|-------------------|
| Hohe Aktivitaet | ~1.700 ETH | ~3.000 ETH | -1.300 ETH | ~-0,4% (deflationaer) |
| **Mittel (aktuell)** | **~1.700 ETH** | **~1.500 ETH** | **+200 ETH** | **~+0,06%** |
| Niedrige Aktivitaet | ~1.700 ETH | ~500 ETH | +1.200 ETH | ~+0,36% |

### Proof of Stake — Validatoren

| Metrik | Wert |
|--------|------|
| Konsens | Proof of Stake (seit Merge, Sep 2022) |
| Min. Stake | 32 ETH (~65.000 USD) |
| Staking APY | ~3-4% |
| Slashing-Risiko | Ja — Fehlverhalten wird bestraft |
| Gestaked | ~36 Mio. ETH (30% des Supplies) — ATH |

### Layer-2-Effekt auf Burn

Kritischer Punkt: **L2s (Arbitrum, Optimism, Base) reduzieren den Mainnet-Burn.** Da Transaktionen zunehmend auf L2s stattfinden, sinken die Mainnet-Fees und damit der Burn. EIP-4844 (Proto-Danksharding) hat L2-Kosten massiv gesenkt — gut fuer Nutzer, aber schlecht fuer die ETH-Deflation.

## Inflation/Deflation

| Phase | Zeitraum | Supply-Aenderung |
|-------|----------|------------------|
| Pre-Merge (PoW) | 2015 - Sep 2022 | +4,3% p.a. (stark inflationaer) |
| Post-Merge (PoS) | Sep 2022 - 2024 | ~0% bis -0,3% (netto deflationaer) |
| **Aktuell (L2-Aera)** | **2025-2026** | **~+0,06% (nahezu neutral)** |

**Kernproblem:** Ethereums deflationaeres Narrativ ("Ultrasound Money") hat an Kraft verloren, weil L2s den Burn reduzieren. Die Netto-Inflation ist zwar nahe null, aber nicht mehr zuverlaessig deflationaer wie 2023-2024.

## Bewertungs-Implikation

| Metrik | Wert | Interpretation |
|--------|------|----------------|
| **FDV** | ~246 Mrd. USD | Identisch mit MCap (kein Max Supply) |
| **FDV/MCap** | 1,00x | Neutral — kein Verwaesserungseffekt |
| **Staking-Yield** | 3-4% APY | Attraktiv als "Crypto-Bond" |
| **Effektiv handelbares Supply** | ~84,5 Mio. ETH | 30% in Staking gebunden |
| **Verwaesserungs-Risiko** | Niedrig-Mittel | Nahe null Netto-Inflation, aber kein Hard Cap |

**Verwaesserungs-Risiko: NIEDRIG-MITTEL.** Ethereum hat zwar kein Max Supply wie Bitcoin, aber der EIP-1559-Burn-Mechanismus haelt die Inflation nahe null. Das Staking von 30% reduziert das effektiv handelbare Supply erheblich. Risikofaktor: Falls L2-Aktivitaet den Mainnet-Burn weiter reduziert, koennte ETH langsam inflationaer werden.

## Fazit

Ethereums Tokenomics sind solide, aber nicht so stark wie Bitcoins:

1. **Kein Hard Cap** — Das fehlende Max Supply ist ein struktureller Nachteil gegenueber Bitcoin
2. **EIP-1559 Burn** — Innovativer Mechanismus, aber abhaengig von Netzwerkaktivitaet
3. **30% gestaked (ATH)** — Massiv reduziertes freies Angebot, plus Yield fuer Halter
4. **L2-Kannibalisierung** — Der Burn wird durch L2-Migration geschwaecht
5. **Netto-Inflation ~0%** — Aktuell nahezu neutral, aber nicht garantiert deflationaer

Ethereums Tokenomics sind besser als die meisten Altcoins (keine wilde Inflation, sinnvoller Burn-Mechanismus, hohe Staking-Quote), aber schwaeker als Bitcoins mathematisch garantierte Knappheit. Der Wert von ETH haengt weniger von der Supply-Mechanik ab und mehr von der Nutzung des Oekosystems.

---
*Erstellt von Satoshi (CFA) am 2026-02-09. Keine Anlageberatung.*
