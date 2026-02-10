import OpenAI from "openai";

const modelId = "gpt-4o-mini" as const;

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing OPENAI_API_KEY" });
    return;
  }

  try {
    const prompt = `Analyze the following LinkedIn post and suggest 10 trending, high-reach hashtags. Focus on niche tags with good engagement, not generic ones like #business.\n\nPost: "${content}"`;
    const client = new OpenAI({ apiKey });
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

    const data = JSON.parse(responseContent);
    res.status(200).json({ hashtags: data.hashtags || [] });
  } catch (error) {
    res.status(200).json({ hashtags: [] });
  }
}
