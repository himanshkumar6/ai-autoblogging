import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";
import { generateBlog } from "@/lib/groq";
import { generateImage } from "@/lib/image";

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

    // 1. Generate Blog Content (Groq)
    console.log(`[Generate-Post] Producing content for topic: ${topic}`);
    const postData = await generateBlog(topic);
    
    // 2. Generate Image (Stubbed returns null)
    const imageUrl = await generateImage(postData.image?.prompt);
    
    // 3. Return combined data
    return NextResponse.json({
      title: postData.title,
      content: postData.content,
      meta_description: postData.meta_description || postData.meta,
      image_url: imageUrl,
      tags: postData.tags || []
    });
  } catch (error: any) {
    console.error("[Generate-Post Critical Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to generate post" }, { status: 500 });
  }
}
