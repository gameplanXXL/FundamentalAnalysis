/**
 * Report Index Generator
 *
 * Scans _bmad-output/stocks/ and _bmad-output/crypto/ for existing reports,
 * parses their metadata (type, ticker, date, recommendation, summary),
 * and generates _bmad-output/report-registry.yaml for cross-workflow discovery.
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, basename } from "node:path";
import { stringify } from "yaml";

// ── Types ──────────────────────────────────────────────────────────────

interface ReportEntry {
  type: string;
  date: string;
  path: string;
  recommendation?: string;
  tickers?: string[];
  summary?: string;
}

interface Registry {
  generated: string;
  report_count: number;
  stocks: Record<string, ReportEntry[]>;
  cryptos: Record<string, ReportEntry[]>;
}

// ── Constants ──────────────────────────────────────────────────────────

const PROJECT_ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const OUTPUT_DIR = join(PROJECT_ROOT, "_bmad-output");
const STOCKS_DIR = join(OUTPUT_DIR, "stocks");
const CRYPTO_DIR = join(OUTPUT_DIR, "crypto");
const REGISTRY_PATH = join(OUTPUT_DIR, "report-registry.yaml");

/** Maps subdirectory name → report type for the registry */
const STOCK_TYPE_MAP: Record<string, string> = {
  decisions: "decision",
  analysis: "analysis",
  comparisons: "comparison",
  morningstar: "morningstar",
  monitor: "monitor",
  risk: "risk",
  sectors: "sector",
  "stress-tests": "stress-test",
};

const CRYPTO_TYPE_MAP: Record<string, string> = {
  analysis: "analysis",
  decisions: "decision",
  comparisons: "comparison",
  market: "market",
  tokenomics: "tokenomics",
};

/** Recommendation keywords to look for in report headers */
const RECOMMENDATION_KEYWORDS = ["BUY", "SELL", "HOLD", "WATCH", "ACCUMULATE", "AVOID"];

// ── Filename Parsing ───────────────────────────────────────────────────

/**
 * Parses a date (YYYY-MM-DD) from the end of a filename stem.
 * Handles crypto tickers like BTC-USD where hyphens are part of the ticker.
 */
function parseDateFromFilename(stem: string): string | null {
  const dateMatch = stem.match(/(\d{4}-\d{2}-\d{2})$/);
  return dateMatch ? dateMatch[1] : null;
}

/**
 * Extracts ticker from a filename stem.
 * Pattern: prefix-TICKER-YYYY-MM-DD
 * For crypto tickers like BTC-USD: parse date from right, prefix from left, rest is ticker.
 */
function parseTickerFromFilename(stem: string, prefix: string): string | null {
  // Remove date suffix
  const withoutDate = stem.replace(/-\d{4}-\d{2}-\d{2}$/, "");
  // Remove type prefix (e.g. "decision-", "analyze-", "morningstar-")
  const prefixPattern = new RegExp(`^${prefix}-`);
  const ticker = withoutDate.replace(prefixPattern, "");
  return ticker || null;
}

/** Known filename prefixes per report type */
const TYPE_PREFIX_MAP: Record<string, string> = {
  decision: "decision",
  analysis: "analyze",
  comparison: "compare",
  morningstar: "morningstar",
  monitor: "monitor-report",
  risk: "risk",
  sector: "sector",
  "stress-test": "stress-test",
  market: "market",
  tokenomics: "tokenomics",
};

// ── Report Header Parsing ──────────────────────────────────────────────

/**
 * Reads the first ~30 lines of a report and extracts:
 * - recommendation (BUY/SELL/HOLD/WATCH)
 * - summary (first meaningful paragraph or Zusammenfassung section)
 * - tickers (for comparison reports: extracted from heading or table)
 */
async function parseReportHeader(
  filePath: string,
  reportType: string
): Promise<{ recommendation?: string; summary?: string; tickers?: string[] }> {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n").slice(0, 50);
  const headerBlock = lines.join("\n");

  let recommendation: string | undefined;
  let summary: string | undefined;
  let tickers: string[] | undefined;

  // Extract recommendation
  for (const keyword of RECOMMENDATION_KEYWORDS) {
    // Match patterns like "**Empfehlung:** WATCH" or "Empfehlung: BUY"
    const recMatch = headerBlock.match(
      new RegExp(`\\*{0,2}Empfehlung\\*{0,2}:?\\s*\\*{0,2}\\s*${keyword}`, "i")
    );
    if (recMatch) {
      recommendation = keyword;
      break;
    }
    // Also check for "**Status:** BUY" in monitor reports
    const statusMatch = headerBlock.match(
      new RegExp(`\\*{0,2}Status\\*{0,2}:?\\s*\\*{0,2}\\s*${keyword}`, "i")
    );
    if (statusMatch) {
      recommendation = keyword;
      break;
    }
  }

  // Extract summary
  if (reportType === "comparison") {
    // For comparisons: extract tickers from heading or table
    tickers = extractTickersFromComparison(headerBlock);
    // Use first heading as summary
    const headingMatch = headerBlock.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      summary = headingMatch[1].replace(/[#*]/g, "").trim();
    }
  } else if (reportType === "monitor") {
    // Monitor reports: count sections as summary
    const tickerSections = content.match(/^## [A-Z]+ —/gm);
    if (tickerSections) {
      summary = `${tickerSections.length} Aktien ueberwacht`;
    }
  } else {
    // Regular reports: find Zusammenfassung or Bewertungs-Einschaetzung section
    const zusammenfassungMatch = headerBlock.match(
      /##\s*Zusammenfassung\s*[\r\n]+\s*(.+)/
    );
    const bewertungsMatch = headerBlock.match(
      /###?\s*Bewertungs-Einsch(?:ae|ä)tzung\s*[\r\n]+\s*(.+)/
    );
    if (zusammenfassungMatch) {
      summary = zusammenfassungMatch[1].trim();
    } else if (bewertungsMatch) {
      summary = bewertungsMatch[1].trim();
    } else {
      // Fallback: first non-empty line after the header block (after ---)
      const afterSeparator = headerBlock.split("---")[1];
      if (afterSeparator) {
        const firstParagraph = afterSeparator
          .split("\n")
          .find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("*"));
        if (firstParagraph) {
          summary = firstParagraph.trim();
        }
      }
    }
  }

  // Truncate summary to ~150 chars
  if (summary && summary.length > 150) {
    summary = summary.slice(0, 147) + "...";
  }

  return { recommendation, summary, tickers };
}

/** Common abbreviations that appear in report tables but are not tickers */
const NON_TICKER_WORDS = new Set([
  "USD", "EUR", "ETF", "CEO", "CFO", "CFA", "SFA", "YOY", "QOQ",
  "KGV", "PEG", "ROE", "ROA", "ROI", "EPS", "TTM", "FCF", "DCF",
  "EBIT", "CAGR", "ATH", "ATL", "IPO", "BTC", "ETH",
]);

/**
 * Extracts ticker symbols from comparison report headers.
 * Looks for patterns like "ORCL vs MSFT" or ticker symbols in tables.
 */
function extractTickersFromComparison(headerBlock: string): string[] {
  const tickers: Set<string> = new Set();

  // Pattern: "ORCL vs MSFT" or "NVDA, AVGO, MRVL"
  const heading = headerBlock.match(/^#\s+(.+)$/m);
  if (heading) {
    const headingText = heading[1];
    // Match uppercase ticker-like tokens (2-5 uppercase letters)
    const matches = headingText.match(/\b[A-Z]{2,5}\b/g);
    if (matches) {
      for (const m of matches) {
        // Filter out common non-ticker words
        if (!NON_TICKER_WORDS.has(m)) {
          tickers.add(m);
        }
      }
    }
  }

  // Also check table rows for ticker patterns like "| **NVDA** |"
  const tableMatches = headerBlock.matchAll(/\|\s*\*{0,2}([A-Z]{2,5})\*{0,2}\s*\|/g);
  for (const match of tableMatches) {
    const t = match[1];
    if (!NON_TICKER_WORDS.has(t)) {
      tickers.add(t);
    }
  }

  return [...tickers];
}

// ── Directory Scanning ─────────────────────────────────────────────────

async function dirExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function scanReports(
  baseDir: string,
  typeMap: Record<string, string>
): Promise<Record<string, ReportEntry[]>> {
  const result: Record<string, ReportEntry[]> = {};

  if (!(await dirExists(baseDir))) {
    return result;
  }

  for (const [subdir, reportType] of Object.entries(typeMap)) {
    const dirPath = join(baseDir, subdir);
    if (!(await dirExists(dirPath))) continue;

    const files = await readdir(dirPath);
    const mdFiles = files.filter((f) => f.endsWith(".md") && f !== ".gitkeep");

    for (const file of mdFiles) {
      const filePath = join(dirPath, file);
      const stem = basename(file, ".md");
      const date = parseDateFromFilename(stem);

      if (!date) continue;

      const prefix = TYPE_PREFIX_MAP[reportType] ?? reportType;
      const ticker = parseTickerFromFilename(stem, prefix);
      const relativePath = filePath.replace(OUTPUT_DIR + "/", "");

      const { recommendation, summary, tickers } = await parseReportHeader(
        filePath,
        reportType
      );

      const entry: ReportEntry = {
        type: reportType,
        date,
        path: relativePath,
      };

      if (recommendation) entry.recommendation = recommendation;
      if (summary) entry.summary = summary;

      // Determine grouping key
      if (reportType === "comparison") {
        if (tickers && tickers.length > 0) entry.tickers = tickers;
        const key = "_comparisons";
        if (!result[key]) result[key] = [];
        result[key].push(entry);
      } else if (reportType === "monitor") {
        const key = "_monitor";
        if (!result[key]) result[key] = [];
        result[key].push(entry);
      } else if (reportType === "market") {
        const key = "_market";
        if (!result[key]) result[key] = [];
        result[key].push(entry);
      } else if (ticker) {
        if (!result[ticker]) result[ticker] = [];
        result[ticker].push(entry);
      }
    }
  }

  // Sort entries per key by date descending
  for (const key of Object.keys(result)) {
    result[key].sort((a, b) => b.date.localeCompare(a.date));
  }

  return result;
}

// ── Main ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("Scanning reports...");

  const stocks = await scanReports(STOCKS_DIR, STOCK_TYPE_MAP);
  const cryptos = await scanReports(CRYPTO_DIR, CRYPTO_TYPE_MAP);

  const stockCount = Object.values(stocks).reduce((sum, arr) => sum + arr.length, 0);
  const cryptoCount = Object.values(cryptos).reduce((sum, arr) => sum + arr.length, 0);
  const totalCount = stockCount + cryptoCount;

  const registry: Registry = {
    generated: new Date().toISOString(),
    report_count: totalCount,
    stocks,
    cryptos,
  };

  // Generate YAML with header comment
  const yamlContent =
    "# Report Registry — auto-generated by src/report-index.ts\n" +
    "# Re-generate: npx tsx src/report-index.ts\n" +
    "# Do not edit manually.\n\n" +
    stringify(registry, { lineWidth: 120 });

  await writeFile(REGISTRY_PATH, yamlContent, "utf-8");

  console.log(`Registry written to ${REGISTRY_PATH}`);
  console.log(`  Stocks: ${stockCount} reports`);
  console.log(`  Cryptos: ${cryptoCount} reports`);
  console.log(`  Total: ${totalCount} reports`);
}

main().catch((err) => {
  console.error("Failed to generate report registry:", err);
  process.exit(1);
});
