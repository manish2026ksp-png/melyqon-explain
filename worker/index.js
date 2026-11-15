const MODEL = "gemini-3.8-flash";
const MAX_TOPIC = 240;
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (url.pathname !== "/generate") return json({ error: "Not found" }, 404);
    if (request.method !== "POST") return json({ error: "Use POST" }, 405);
    if (!env.GEMINI_API_KEY) return json({ error: "Worker secret GEMINI_API_KEY is not configured" }, 500);

    let input;
    try { input = await request.json(); }
    catch { return json({ error: "Invalid JSON body" }, 400); }

    const topic = String(input.topic || "").trim().slice(0, MAX_TOPIC);
    const audience = String(input.audience || "Curious beginners").slice(0, 80);
    const format = ["short", "carousel", "lesson"].includes(input.format) ? input.format : "short";
    const sources = String(input.sources || "").slice(0, 3000);
    if (!topic) return json({ error: "Please provide a topic" }, 400);

    const formatName = format === "short" ? "60-second short" : format === "carousel" ? "6-slide carousel" : "3-minute mini lesson";
    const prompt = `Write a complete explainer script. Never use placeholders or tell the user to write the script themselves.
Topic: ${topic}
Audience: ${audience}
Format: ${formatName}
User-provided source references (not fetched or verified): ${sources || "None"}
Include: one-sentence takeaway; timed narration beats or slide copy; concrete visual direction per beat; simple mechanism explanation; one analogy with limits; concise caption; source checklist; three fact-check questions.
Use plain language, avoid invented statistics/quotes/citations, state uncertainty, and output Markdown only. If no sources are supplied, suggest trustworthy primary-source organisations and search phrases, not fabricated URLs. Do not claim to have browsed or verified anything.`;

    try {
      const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.55, maxOutputTokens: 2200 }
        })
      });
      const raw = await upstream.text();
      let payload;
      try { payload = JSON.parse(raw); }
      catch {
        const detail = raw.trim().slice(0, 180) || "Empty response";
        return json({ error: "Gemini returned a non-JSON response (HTTP " + upstream.status + "): " + detail }, 502);
      }
      if (!upstream.ok) return json({ error: payload.error?.message || "Gemini API request failed (HTTP " + upstream.status + ")" }, upstream.status);
      const text = payload.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
      if (!text) return json({ error: "No text returned by the model" }, 502);
      return json({ text });
    } catch (error) {
      console.error("Gemini provider request failed:", error?.name || "Error", error?.message || "Unknown error");
      const detail = String(error?.message || "Unknown network or response error").slice(0, 240);
      return json({ error: "Gemini provider request failed: " + detail }, 502);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
  });
}
