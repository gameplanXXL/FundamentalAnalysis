import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import type { Alert } from "./trigger-evaluator.js";

export interface MonitorResult {
  ticker: string;
  name: string;
  status: string;
  price?: number;
  alerts: Alert[];
}

// --- Console ---

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

function colorForSeverity(severity: string): string {
  if (severity === "critical") return RED;
  if (severity === "warning") return YELLOW;
  return DIM;
}

function statusIcon(fired: boolean): string {
  return fired ? "🔴" : "✅";
}

export function notifyConsole(results: MonitorResult[]): void {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  console.log(`\n${BOLD}=== Stock Monitor Report ===${RESET}`);
  console.log(`${DIM}${now}${RESET}\n`);

  let totalFired = 0;

  for (const result of results) {
    const firedAlerts = result.alerts.filter((a) => a.fired);
    totalFired += firedAlerts.length;

    const priceStr = result.price != null ? `$${result.price.toFixed(2)}` : "N/A";
    const statusColor = firedAlerts.length > 0 ? RED : GREEN;
    console.log(
      `${BOLD}${result.ticker}${RESET} — ${result.name} [${result.status}] ${priceStr} ${statusColor}(${firedAlerts.length} alerts)${RESET}`,
    );

    for (const alert of result.alerts) {
      const icon = statusIcon(alert.fired);
      const color = alert.fired ? colorForSeverity(alert.severity) : DIM;
      const valueStr = formatValue(alert.metric, alert.currentValue);
      const threshStr = formatValue(alert.metric, alert.threshold);
      console.log(
        `  ${icon} ${color}${alert.label}${RESET} — aktuell: ${valueStr}, Schwelle: ${threshStr} → ${alert.action}`,
      );
    }
    console.log();
  }

  const summary = totalFired > 0
    ? `${RED}${BOLD}${totalFired} Alert(s) ausgeloest!${RESET}`
    : `${GREEN}Keine Alerts ausgeloest.${RESET}`;
  console.log(`${BOLD}Zusammenfassung:${RESET} ${summary}\n`);
}

function formatValue(metric: string, value: number): string {
  if (metric.includes("margin") || metric.includes("growth") || metric.includes("yield")) {
    return `${(value * 100).toFixed(2)}%`;
  }
  if (metric.includes("net_debt") || metric.includes("fcf")) {
    if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(0)}`;
  }
  if (metric.includes("price")) return `$${value.toFixed(2)}`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(4);
}

// --- Markdown Report ---

export function notifyMarkdown(results: MonitorResult[]): string {
  const date = new Date().toISOString().slice(0, 10);
  const outputDir = resolve(process.cwd(), "_bmad-output", "stock-analysis");
  mkdirSync(outputDir, { recursive: true });

  const lines: string[] = [];
  lines.push(`# Stock Monitor Report — ${date}`);
  lines.push("");
  lines.push(`> Automatisch generiert am ${new Date().toISOString().slice(0, 19).replace("T", " ")} UTC`);
  lines.push("");

  let totalFired = 0;

  for (const result of results) {
    const firedAlerts = result.alerts.filter((a) => a.fired);
    totalFired += firedAlerts.length;

    const priceStr = result.price != null ? `$${result.price.toFixed(2)}` : "N/A";
    lines.push(`## ${result.ticker} — ${result.name}`);
    lines.push("");
    lines.push(`- **Status:** ${result.status}`);
    lines.push(`- **Kurs:** ${priceStr}`);
    lines.push(`- **Alerts:** ${firedAlerts.length} von ${result.alerts.length} ausgeloest`);
    lines.push("");

    if (result.alerts.length > 0) {
      lines.push("| Status | Trigger | Aktuell | Schwelle | Aktion |");
      lines.push("|--------|---------|---------|----------|--------|");

      for (const alert of result.alerts) {
        const status = alert.fired ? "🔴 ALERT" : "✅ OK";
        const valueStr = formatValue(alert.metric, alert.currentValue);
        const threshStr = formatValue(alert.metric, alert.threshold);
        lines.push(`| ${status} | ${alert.label} | ${valueStr} | ${threshStr} | ${alert.action} |`);
      }
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push(
    totalFired > 0
      ? `**⚠️ ${totalFired} Alert(s) ausgeloest — Handlungsbedarf pruefen!**`
      : "**✅ Keine Alerts ausgeloest.**",
  );
  lines.push("");

  const content = lines.join("\n");
  const filePath = resolve(outputDir, `monitor-report-${date}.md`);
  writeFileSync(filePath, content, "utf-8");
  console.log(`📄 Report gespeichert: ${filePath}`);

  return filePath;
}

// --- Telegram ---

export async function notifyTelegram(results: MonitorResult[]): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const firedAlerts = results.flatMap((r) =>
    r.alerts.filter((a) => a.fired).map((a) => ({ ...a, stockName: r.name })),
  );
  if (firedAlerts.length === 0) return;

  const lines = ["📊 *Stock Monitor Alert*", ""];
  for (const alert of firedAlerts) {
    const icon = alert.severity === "critical" ? "🔴" : alert.severity === "warning" ? "🟡" : "ℹ️";
    lines.push(`${icon} *${alert.ticker}* — ${alert.label}`);
    lines.push(`   Aktion: ${alert.action} | Aktuell: ${alert.currentValue} | Schwelle: ${alert.threshold}`);
  }

  const text = lines.join("\n");

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
    if (!resp.ok) {
      console.error(`Telegram error: ${resp.status} ${await resp.text()}`);
    } else {
      console.log("📱 Telegram-Nachricht gesendet.");
    }
  } catch (err) {
    console.error("Telegram send failed:", err);
  }
}

// --- Email ---

export async function notifyEmail(results: MonitorResult[]): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.ALERT_EMAIL_TO;
  if (!host || !user || !pass || !to) return;

  const firedAlerts = results.flatMap((r) =>
    r.alerts.filter((a) => a.fired).map((a) => ({ ...a, stockName: r.name })),
  );
  if (firedAlerts.length === 0) return;

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port ?? "587", 10),
      secure: parseInt(port ?? "587", 10) === 465,
      auth: { user, pass },
    });

    const date = new Date().toISOString().slice(0, 10);
    const lines = firedAlerts.map(
      (a) => `[${a.severity.toUpperCase()}] ${a.ticker}: ${a.label} (Aktion: ${a.action}, Aktuell: ${a.currentValue}, Schwelle: ${a.threshold})`,
    );

    await transporter.sendMail({
      from: user,
      to,
      subject: `Stock Monitor: ${firedAlerts.length} Alert(s) — ${date}`,
      text: `Stock Monitor Alert Report\n${"=".repeat(40)}\n\n${lines.join("\n")}\n`,
    });

    console.log("📧 Email-Benachrichtigung gesendet.");
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

// --- Combined ---

export async function notify(results: MonitorResult[]): Promise<void> {
  notifyConsole(results);
  notifyMarkdown(results);
  await notifyTelegram(results);
  await notifyEmail(results);
}
