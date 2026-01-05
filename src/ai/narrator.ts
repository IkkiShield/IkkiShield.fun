import fetch from "node-fetch";

export async function generateNarration(opts: {
  endpoint: string;
  apiKey: string;
  model: string;
  prompt: string;
}): Promise<string> {
  const { endpoint, apiKey, model, prompt } = opts;
  if (!endpoint || !apiKey) {
    // Fallback: canned larp copy
    return `🤖 AI BOT: Dip detected. Protocol reallocates dev fees + profits back into the chart. Volatility is the feature.`;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a hype-but-clear meme coin bot. Do not claim to execute real trades; describe simulated reinjection plans." },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!res.ok) throw new Error(`AI request failed: ${res.status} ${res.statusText}`);
  const json: any = await res.json();
  return json?.choices?.[0]?.message?.content?.trim() ?? "🤖 AI BOT: Reinjection planned.";
}
