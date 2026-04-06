import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || "",
});

export async function POST(request: Request) {
  try {
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

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      temperature: 0.7,
      system: "You are an API that outputs strictly JSON. Do not output anything other than parsable JSON.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const outputText = msg.content[0].type === "text" ? msg.content[0].text : "";
    
    const cleanJsonText = outputText.replace(/^```json\n?/, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleanJsonText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error generating tweet:", error);
    return NextResponse.json({ error: error.message || "Failed to generate tweet" }, { status: 500 });
  }
}
