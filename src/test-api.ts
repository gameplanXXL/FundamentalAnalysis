import { eodhd } from "./lib/eodhd-client.js";

async function testApi() {
  console.log("=== EODHD API Connection Test ===\n");

  try {
    console.log("1. Search for Oracle...");
    const search = await eodhd.search("Oracle", { limit: 3 });
    console.log("   Found:", search.map((s) => `${s.Code}.${s.Exchange} (${s.Name})`).join(", "));
    console.log("   OK\n");

    console.log("2. Get real-time price for ORCL.US...");
    const price = await eodhd.getRealTimePrice("ORCL.US");
    console.log(`   Price: ${price.close}, Change: ${price.change_p}%`);
    console.log("   OK\n");

    console.log("3. Get highlights for ORCL.US...");
    const highlights = await eodhd.getFundamentals("ORCL.US", "Highlights");
    const hl = highlights as Record<string, unknown>;
    console.log(`   Market Cap: ${hl.MarketCapitalization}, P/E: ${hl.PERatio}`);
    console.log("   OK\n");

    console.log("4. Get EOD price (last 5 days) for ORCL.US...");
    const eod = await eodhd.getEodPrice("ORCL.US", { period: "d", order: "d" });
    console.log(`   Last 3 entries:`, eod.slice(0, 3).map((e) => `${e.date}: ${e.close}`));
    console.log("   OK\n");

    console.log("=== All tests passed ===");
  } catch (err) {
    console.error("TEST FAILED:", err);
    process.exit(1);
  }
}

testApi();
