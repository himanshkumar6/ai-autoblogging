import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { logStep } from "@/lib/logger";
import { withRetry } from "@/lib/ai-retry";

const topics = [
  "Bitcoin price prediction",
  "Top trending cryptocurrencies today",
  "Best side hustles in 2026",
  "AI tools for making money",
  "Personal finance tips for beginners",
];

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request: Request) {
  headers(); 
  const supabase = getSupabaseAdmin();
  const { origin: baseUrl } = new URL(request.url);

  try {
    // 1. Pick a topic (Soon to be dynamic Trend)
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const logMetadata: Record<string, any> = { topic };
    const internalHeaders = {
      "Content-Type": "application/json",
      "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
    };

    // 2. Generate Blog Post with Retry
    console.log(`[Auto-Run] Starting generation for: ${topic}`);
    
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

    // 3. Save to Supabase (Observability Step)
    const slug = generateSlug(postData.title);
    logMetadata["slug"] = slug;

    const { data: insertedPost, error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          title: postData.title,
          slug: slug,
          content: postData.content,
          meta_description: postData.meta,
        },
      ])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        const newSlug = `${slug}-${Math.floor(Math.random() * 10000)}`;
        const { error: retryError } = await supabase
          .from("posts")
          .insert([{ title: postData.title, slug: newSlug, content: postData.content, meta_description: postData.meta }]);
        
        if (retryError) throw new Error(`DB collision handling failed: ${retryError.message}`);
        logStep("save", "success", "Saved post with collision slug", logMetadata);
      } else {
        logStep("save", "fail", insertError.message, logMetadata);
        throw new Error(`DB Insert Error: ${insertError.message}`);
      }
    } else {
      logStep("save", "success", `Saved post: ${slug}`, logMetadata);
    }

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
