import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "yaml";
import { watchlistSchema, type Watchlist } from "./watchlist-schema.js";

export function loadWatchlist(configPath?: string): Watchlist {
  const filePath = configPath ?? resolve(process.cwd(), "config", "watchlist.yaml");
  const raw = readFileSync(filePath, "utf-8");
  const parsed = parse(raw);
  return watchlistSchema.parse(parsed);
}
