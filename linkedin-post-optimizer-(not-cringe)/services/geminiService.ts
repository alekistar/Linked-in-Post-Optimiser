import { Tone, OptimizedPost } from "../types";

const getApiBase = (): string => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  return apiBase ? apiBase.replace(/\/$/, "") : "";
};

export const generateOptimizedPosts = async (
  draft: string,
  tone: Tone
): Promise<OptimizedPost[]> => {
  if (!draft?.trim()) {
    throw new Error("Draft content cannot be empty");
  }

  try {
    const response = await fetch(`${getApiBase()}/api/optimize-posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draft, tone }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody?.error || "Failed to generate posts";
      throw new Error(message);
    }

    return (await response.json()) as OptimizedPost[];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Post generation failed:", message);
    throw error;
  }
};

export const suggestTrendingHashtags = async (content: string): Promise<string[]> => {
  if (!content?.trim()) {
    return [];
  }

  try {
    const response = await fetch(`${getApiBase()}/api/hashtags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data?.hashtags as string[]) || [];
  } catch (error) {
    console.error("Hashtag suggestion failed:", error);
    return [];
  }
};
