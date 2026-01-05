import "dotenv/config";

export const CONFIG = {
  pairUrl: process.env.DEXSCREENER_PAIR_URL ?? "",
  dipThreshold: Number(process.env.DIP_THRESHOLD ?? "0.25"),
  pollMs: Number(process.env.POLL_MS ?? "15000"),
  discordWebhook: process.env.DISCORD_WEBHOOK ?? "",
  ai: {
    endpoint: process.env.AI_ENDPOINT ?? "",
    apiKey: process.env.AI_API_KEY ?? "",
    model: process.env.AI_MODEL ?? "gpt-4.1-mini"
  }
};

if (!CONFIG.pairUrl) {
  console.warn("⚠️  Missing DEXSCREENER_PAIR_URL (bot will not run correctly).");
}
