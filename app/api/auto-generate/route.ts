import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getTrendingTopic } from "@/lib/trending";
import { generateBlog } from "@/lib/groq";
import { generateImage } from "@/lib/image";
import { createPost } from "@/lib/supabase-core";

export async function GET(request: Request) {
  // MANDATORY TRIGGER LOG
  console.log("=== AUTO GENERATE TRIGGERED ===");
  
  headers(); 
  
  // 0. Security Check (Development vs Production)
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      console.warn("[Auto-Generate] Production Auth Failed: Missing or invalid Bearer token");
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }
  } else {
    console.log("[Auto-Generate] Running in Development mode: Auth check skipped");
  }

  try {
    // 1. Get trending topic
    const topic = await getTrendingTopic();
    console.log(`[Auto-Generate] Topic Selected: ${topic}`);

    // 2. Generate blog using Groq
    const postData = await generateBlog(topic);
    
    // 3. Generate Image (Stability Core v2beta)
    const imageUrl = await generateImage(postData.image?.prompt);
    
    // SOURCE ATTRIBUTION
    if (!imageUrl) {
      console.warn("⚠️ FALLBACK IMAGE USED");
    }

    // FINAL AUDIT LOG
    const fallbackImage = "https://images.unsplash.com/photo-1518770660439-4636190af475";
    const finalImageUrl = imageUrl || fallbackImage;
    
    console.log("=== FINAL IMAGE URL ===");
    console.log(finalImageUrl);

    // 4. Save post with image_url (Atomic Guarantee)
    const combinedData = {
      ...postData,
      image_url: finalImageUrl,
      published: true
    };

    const savedPost = await createPost(combinedData);

    // 5. Return full response
    return NextResponse.json({
      success: true,
      data: savedPost
    });

  } catch (error: any) {
    console.error("[Auto-Generate Critical Failure]:", error.message);
    return NextResponse.json({ 
      error: error.message || "Failed to orchestrate pipeline",
      status: "fail" 
    }, { status: 500 });
  }
}
