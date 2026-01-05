import fetch from "node-fetch";

export async function postDiscord(webhookUrl: string, content: string) {
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
}
