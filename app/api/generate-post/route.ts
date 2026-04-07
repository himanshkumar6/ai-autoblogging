import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import { generateContent } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkAdminAuth(request);

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

    const result = await generateContent(prompt);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error generating post:", error);
    return NextResponse.json({ error: error.message || "Failed to generate post" }, { status: 500 });
  }
}
