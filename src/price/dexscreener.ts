import fetch from "node-fetch";
import type { PriceSample } from "./types.js";

export async function fetchDexscreenerPrice(pairUrl: string): Promise<PriceSample> {
  const res = await fetch(pairUrl);
  if (!res.ok) throw new Error(`Dexscreener fetch failed: ${res.status} ${res.statusText}`);
  const json: any = await res.json();

  // Dexscreener shape: { pairs: [...] }
  const pair = json?.pairs?.[0];
  if (!pair?.priceUsd) throw new Error("No priceUsd in Dexscreener response.");

  return {
    ts: Date.now(),
    priceUsd: Number(pair.priceUsd),
    liquidityUsd: pair?.liquidity?.usd ? Number(pair.liquidity.usd) : undefined,
    fdvUsd: pair?.fdv ? Number(pair.fdv) : undefined
  };
}
