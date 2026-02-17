import OpenAI from "openai";

const modelId = "mixtral-8x7b-32768" as const;

const systemInstruction = `You are an expert LinkedIn ghostwriter known for "Zero Cringe" content. Rewrite rough drafts into high-performing, authentic LinkedIn posts.

Principles:
- NO corporate jargon (synergy, delighted to announce, humbled)
- NO fake toxic positivity or hustle culture
- Focus on storytelling, vulnerability, or technical insights based on tone
- Use short paragraphs and clear hooks

Tones:
- Builder: "how", craft, tools, challenges, problem-solving. Humble but competent.
- Student: curiosity, "today I learned", admitting knowledge gaps, asking for advice.
- Founder: journey, hard lessons, pivots, building in public, team appreciation.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { draft, tone } = req.body || {};
  if (!draft || typeof draft !== "string" || !draft.trim()) {
    res.status(400).json({ error: "Draft is required" });
    return;
  }

  if (!tone || typeof tone !== "string") {
    res.status(400).json({ error: "Tone is required" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is missing");
    res.status(500).json({ error: "Server is missing GROQ_API_KEY" });
    return;
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const prompt = `Rewrite the following draft into 3 distinct variations using the "${tone}" tone.\n\nDraft: "${draft}"\n\nReturn JSON ONLY in the shape: { "posts": [ { "headline": "", "content": "", "tags": [""], "toneExplanation": "" } ] }`;

    const response = await client.chat.completions.create({
      model: modelId,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: "No response from model" });
      return;
    }

    let data: { posts?: unknown };
    try {
      data = JSON.parse(content) as { posts?: unknown };
    } catch (parseError) {
      console.error("Failed to parse model JSON", parseError, content.slice(0, 500));
      res.status(502).json({ error: "Model returned invalid JSON" });
      return;
    }

    if (!Array.isArray(data.posts)) {
      console.error("Model JSON missing posts array", data);
      res.status(502).json({ error: "Model returned unexpected JSON" });
      return;
    }

    res.status(200).json(data.posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Groq optimize-posts error", error);
    res.status(500).json({ error: message || "Failed to generate posts" });
  }
}
