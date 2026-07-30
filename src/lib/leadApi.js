/*
 * Forwards lead data to an external app (Performo) via a plain JSON POST.
 * Used by src/app/api/chatbot/route.js and src/app/api/contact/route.js.
 *
 * Required environment variables (see .env.example):
 *   LEAD_API_URL - endpoint on the receiving app that accepts the lead
 *   LEAD_API_KEY - optional API key sent as the x-api-key header
 */

const LEAD_API_TIMEOUT_MS = 8000;

export function isLeadApiConfigured() {
  return Boolean(process.env.LEAD_API_URL);
}

export async function sendLead(data) {
  const url = process.env.LEAD_API_URL;
  const apiKey = process.env.LEAD_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LEAD_API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {}),
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Lead API responded with ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
