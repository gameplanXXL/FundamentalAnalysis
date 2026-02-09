/**
 * Fear & Greed Index from Alternative.me API (free, no API key needed).
 * Returns a value 0-100 with classification.
 * In-memory cache with 1h TTL — fetched once per monitor run.
 */

interface FearGreedResponse {
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
  }>;
}

export interface FearGreedData {
  value: number;
  classification: string;
}

let cachedData: FearGreedData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchFearGreedIndex(): Promise<FearGreedData | null> {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedData;
  }

  try {
    const response = await fetch("https://api.alternative.me/fng/?limit=1");
    if (!response.ok) {
      console.error(`Fear & Greed API error: ${response.status}`);
      return null;
    }

    const json = (await response.json()) as FearGreedResponse;
    if (!json.data || json.data.length === 0) return null;

    cachedData = {
      value: parseInt(json.data[0].value, 10),
      classification: json.data[0].value_classification,
    };
    cacheTimestamp = now;
    return cachedData;
  } catch (err) {
    console.error("Fear & Greed fetch failed:", err);
    return null;
  }
}
