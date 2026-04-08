import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { logStep } from "@/lib/logger";
import { withRetry } from "@/lib/ai-retry";
import { getTrendingTopic } from "@/lib/trending";

export async function GET(request: Request) {
  headers(); 
  const { origin: baseUrl } = new URL(request.url);

  try {
    // 1. Dynamic Topic Selection
    const topic = await getTrendingTopic();
    const logMetadata: Record<string, any> = { topic };
    const internalHeaders = {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
    };

    console.log(`[Auto-Run] Orchestrating pipeline for: ${topic}`);
    
    // 2. Generate Content & Image (Consolidated)
    const postData = await withRetry(async () => {
      const response = await fetch(`${baseUrl}/api/generate-post`, {
        method: "POST",
        headers: internalHeaders,
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`AI generation failed: ${errorMsg}`);
      }
      return response.json();
    });

    logStep("generate", "success", `Generated post: ${postData.title}`, logMetadata);

    // 3. Persist to Database (Centralized Logic)
    const saveResult = await withRetry(async () => {
      const response = await fetch(`${baseUrl}/api/save-post`, {
        method: "POST",
        headers: internalHeaders,
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          meta: postData.meta_description,
          image_url: postData.image_url,
          published: true
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Save post failed: ${errorMsg}`);
      }
      return response.json();
    });

    const slug = saveResult.slug;
    logMetadata["slug"] = slug;
    logStep("save", "success", `Saved post: ${slug}`, logMetadata);

    // 4. Generate & Post Tweet
    console.log(`[Auto-Run] Preparing social distribution`);
    const postUrl = `${baseUrl}/blog/${slug}`;

    try {
      // 4a. Generate Tweet Content
      const tweetData = await withRetry(async () => {
        const res = await fetch(`${baseUrl}/api/generate-tweet`, {
          method: "POST",
          headers: internalHeaders,
          body: JSON.stringify({ content: postData.content, url: postUrl }),
        });
        if (!res.ok) throw new Error("Tweet generation failed");
        return res.json();
      });

      // 4b. Post to X
      const tweetResult = await withRetry(async () => {
        const res = await fetch(`${baseUrl}/api/post-tweet`, {
          method: "POST",
          headers: internalHeaders,
          body: JSON.stringify({ tweet: tweetData.tweet }),
        });
        if (!res.ok) return { error: await res.text() };
        return res.json();
      });

      if (tweetResult.error) {
        logStep("tweet", "fail", tweetResult.error, logMetadata);
      } else {
        const supabase = getSupabaseAdmin();
        await supabase.from("posts").update({ tweeted: true }).eq("slug", slug);
        logStep("tweet", "success", "Posted to X successfully", logMetadata);
      }

    } catch (socialError: any) {
      logStep("tweet", "fail", socialError.message, logMetadata);
      console.error("[Auto-Run] Social distribution failed:", socialError.message);
    }

    return NextResponse.json({ success: true, slug, topic });
  } catch (error: any) {
    console.error(`[Auto-Run Critical Failure]`, error.message);
    logStep("generate", "fail", error.message, { error: error.stack });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
