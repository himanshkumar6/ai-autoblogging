import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access. Admin privileges required." }, { status: 401 });
    }
    const { content, url } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const prompt = `You are an expert Social Media Manager for X (Twitter).
Create an engaging promotional tweet for the following blog post content.

Guidelines for the Tweet:
1. Start with a strong Hook line to grab attention.
2. Include 2-3 short, punchy value lines summarizing the core of the article.
3. End with a Call To Action (CTA) and include this specific URL at the end: ${url || "https://example.com/blog/url"}
4. DO NOT use hashtags unless they are extremely relevant (max 1 or 2).
5. Keep it well under the character limit. Use emojis tastefully.

Your output MUST be strictly valid JSON matching this schema:
{
  "tweet": "The full text of the tweet"
}

Do not include any extra text before or after the JSON. Provide only valid JSON.

BLOG CONTENT TO SUMMARIZE:
${content.substring(0, 3000)}... (truncated for length)
`;

    const result = await generateContent(prompt);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error generating tweet:", error);
    return NextResponse.json({ error: error.message || "Failed to generate tweet" }, { status: 500 });
  }
}
