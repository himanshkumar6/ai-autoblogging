import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Whitelist check (same as middleware)
    const ADMIN_EMAILS = [
      "admin@cryptonews.local", 
      process.env.ADMIN_EMAIL || ""
    ].filter(Boolean);

    const isAuthorized = user && ADMIN_EMAILS.includes(user.email || "");

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access. Admin privileges required." }, { status: 401 });
    }

    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `You are an expert SEO copywriter and technical blogger. 
Write a comprehensive, engaging, and highly informative blog post about: "${topic}".

Your output MUST be strictly valid JSON matching this schema:
{
  "title": "A catchy, SEO-optimized title",
  "meta": "A compelling meta description under 160 characters",
  "content": "The full blog content (800-1200 words) formatted in basic HTML (<h1>, <h2>, <p>, <ul>, <li>, <strong>). Use clean HTML tags without markdown codeblock formatting, just raw JSON."
}

Do not include any extra text before or after the JSON. Provide only valid JSON. Ensure the content uses headings, bullet points, and simple English.`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4000,
      temperature: 0.7,
      system: "You are an API that outputs strictly JSON. Do not output anything other than parsable JSON.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const outputText = msg.content[0].type === "text" ? msg.content[0].text : "";
    
    // Parse the JSON. Claude might wrap it in markdown codeblocks if it ignores the prompt, so cleanup just in case.
    const cleanJsonText = outputText.replace(/^```json\n?/, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleanJsonText);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error generating post:", error);
    return NextResponse.json({ error: error.message || "Failed to generate post" }, { status: 500 });
  }
}
