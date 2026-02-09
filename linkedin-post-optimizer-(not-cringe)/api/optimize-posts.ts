import { GoogleGenAI, Type } from "@google/genai";

const modelId = "gemini-2.0-flash" as const;

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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Rewrite the following draft into 3 distinct variations using the "${tone}" tone.\n\nDraft: "${draft}"`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: {
                type: Type.STRING,
                description: "Catchy, short first line hook.",
              },
              content: {
                type: Type.STRING,
                description: "Full body of post with line breaks.",
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-5 relevant hashtags.",
              },
              toneExplanation: {
                type: Type.STRING,
                description: "Brief explanation of tone alignment.",
              },
            },
            required: ["headline", "content", "tags", "toneExplanation"],
          },
        },
      },
    });

    if (!response.text) {
      res.status(502).json({ error: "No response from model" });
      return;
    }

    res.status(200).json(JSON.parse(response.text));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message || "Failed to generate posts" });
  }
}
