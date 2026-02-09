import type { Operator } from "./watchlist-schema.js";

export interface Alert {
  ticker: string;
  metric: string;
  label: string;
  action: string;
  currentValue: number;
  threshold: number;
  fired: boolean;
  severity: "critical" | "warning" | "info";
}

export function compare(actual: number, operator: Operator, threshold: number): boolean {
  switch (operator) {
    case "<": return actual < threshold;
    case ">": return actual > threshold;
    case "<=": return actual <= threshold;
    case ">=": return actual >= threshold;
    case "==": return actual === threshold;
  }
}

export function severityForAction(action: string): "critical" | "warning" | "info" {
  if (action === "SELL") return "critical";
  if (action === "BUY" || action === "BUY_MORE") return "warning";
  return "info";
}
