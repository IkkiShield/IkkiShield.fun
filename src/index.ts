import { CONFIG } from "./config.js";
import { fetchDexscreenerPrice } from "./price/dexscreener.js";
import { DipDetector } from "./dip/dipDetector.js";
import { TreasuryLedger } from "./treasury/ledger.js";
import { planReinject, executeReinject } from "./treasury/reinjector.js";
import { generateNarration } from "./ai/narrator.js";
import { postDiscord } from "./notify/discord.js";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const detector = new DipDetector(CONFIG.dipThreshold);
  const ledger = new TreasuryLedger();

  console.log("🟢 LARP Dip-Reinject Bot starting…");
  console.log(`Pair: ${CONFIG.pairUrl}`);
  console.log(`Dip threshold: ${(CONFIG.dipThreshold * 100).toFixed(0)}%`);
  console.log(`Poll: ${CONFIG.pollMs}ms`);

  while (true) {
    try {
      const sample = await fetchDexscreenerPrice(CONFIG.pairUrl);
      const dip = detector.ingest(sample);

      // LARP: simulate fees + profits coming in over time
      // (You can replace this with real accounting inputs from your backend.)
      ledger.creditDevFees(5);     // $5 per tick
      ledger.creditProfits(2.5);   // $2.5 per tick

      process.stdout.write(
        `\r$${sample.priceUsd.toFixed(6)} | fees=${ledger.snapshot().devFeesUsd.toFixed(2)} profits=${ledger.snapshot().profitsUsd.toFixed(2)}     `
      );

      if (dip) {
        console.log("\n📉 Dip event:", dip);

        const plan = planReinject(ledger, dip);
        const tx = await executeReinject(plan);

        const narration = await generateNarration({
          endpoint: CONFIG.ai.endpoint,
          apiKey: CONFIG.ai.apiKey,
          model: CONFIG.ai.model,
          prompt: `Token dipped ${(dip.drawdownPct * 100).toFixed(1)}% from peak.
Plan: reinject ALL dev fees ($${plan.devFeesUsd.toFixed(2)}) + ALL profits ($${plan.profitsUsd.toFixed(2)}), total $${plan.totalUsd.toFixed(2)}.
Make it meme-y but transparent that this is a simulated plan, not real trades.`
        });

        const msg =
          `🟠 REINJECTION TRIGGERED (LARP)\n` +
          `Dip level: ${dip.dipLevel} (>= ${(dip.dipLevel * 25).toFixed(0)}%)\n` +
          `Peak: $${dip.peakPrice.toFixed(6)} → Now: $${dip.dipPrice.toFixed(6)}\n` +
          `Reinject: dev fees $${plan.devFeesUsd.toFixed(2)} + profits $${plan.profitsUsd.toFixed(2)} = $${plan.totalUsd.toFixed(2)}\n` +
          `Tx: ${tx.txId}\n\n` +
          `${narration}`;

        console.log(msg);
        await postDiscord(CONFIG.discordWebhook, msg);
      }
    } catch (e: any) {
      console.error("\n❌ Error:", e?.message ?? e);
    }

    await sleep(CONFIG.pollMs);
  }
}

main();
