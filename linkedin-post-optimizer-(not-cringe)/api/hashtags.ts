import OpenAI from "openai";

const modelId = "mixtral-8x7b-32768" as const;

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

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is missing");
    res.status(500).json({ error: "Server is missing GROQ_API_KEY" });
    return;
  }

  try {
    const prompt = `Analyze the following LinkedIn post and suggest 10 trending, high-reach hashtags. Focus on niche tags with good engagement, not generic ones like #business.\n\nPost: "${content}"`;
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const response = await client.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nReturn JSON ONLY in the shape: { "hashtags": ["#tag"] }`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      res.status(200).json({ hashtags: [] });
      return;
    }

    let data: { hashtags?: unknown };
    try {
      data = JSON.parse(responseContent) as { hashtags?: unknown };
    } catch (parseError) {
      console.error("Failed to parse hashtags JSON", parseError, responseContent.slice(0, 500));
      res.status(200).json({ hashtags: [] });
      return;
    }

    if (!Array.isArray(data.hashtags)) {
      console.error("Model JSON missing hashtags array", data);
      res.status(200).json({ hashtags: [] });
      return;
    }

    res.status(200).json({ hashtags: data.hashtags });
  } catch (error) {
    console.error("Groq hashtags error", error);
    res.status(200).json({ hashtags: [] });
  }
}
