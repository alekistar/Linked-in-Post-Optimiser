import { GoogleGenAI, Type } from "@google/genai";

const modelId = "gemini-2.0-flash" as const;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { content } = req.body || {};
  if (!content || typeof content !== "string" || !content.trim()) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze the following LinkedIn post and suggest 10 trending, high-reach hashtags. Focus on niche tags with good engagement, not generic ones like #business.\n\nPost: "${content}"`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    if (!response.text) {
      res.status(200).json({ hashtags: [] });
      return;
    }

    const data = JSON.parse(response.text);
    res.status(200).json({ hashtags: data.hashtags || [] });
  } catch (error) {
    res.status(200).json({ hashtags: [] });
  }
}
