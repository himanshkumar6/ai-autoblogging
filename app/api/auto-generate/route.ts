import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTrendingTopic } from "@/lib/trending";
import { generateBlog } from "@/lib/groq";
import { generateImage } from "@/lib/image";
import { createPost } from "@/lib/supabase-core";

// 1. CORE CONFIGURATION
export const dynamic = "force-dynamic";
export const maxDuration = 300;
export const runtime = "nodejs";

/**
 * SHARED ORCHESTRATOR
 */
async function orchestrateGeneration(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] === STARTING AUTO-GENERATION PIPELINE ===`);

  // 2. AUTHENTICATION SYSTEM
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const adminToken = process.env.ADMIN_TOKEN;

    const isCronTrigger = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const isAdminTrigger = adminToken && authHeader === `Bearer ${adminToken}`;

    if (!isCronTrigger && !isAdminTrigger) {
      console.warn(
        `[${requestId}] [Auth] Unauthorized access attempt blocked.`,
      );
      return NextResponse.json(
        { error: "Unauthorized. Valid CRON_SECRET or ADMIN_TOKEN required." },
        { status: 401 },
      );
    }
    console.log(
      `[${requestId}] [Auth] Verified: ${isCronTrigger ? "Vercel Cron" : "Admin/Manual"}`,
    );
  } catch (authError) {
    console.error(`[${requestId}] [Auth Critical]`, authError);
    return NextResponse.json(
      { error: "Authentication system failure" },
      { status: 500 },
    );
  }

  // 3. SEGMENTED PIPELINE EXECUTION
  let topic = "";
  let blogData = null;
  let finalImageUrl =
    "https://images.unsplash.com/photo-1518770660439-4636190af475";

  try {
    // STEP 1: Trending Topic Discovery
    console.log(`[${requestId}] [Step 1] Fetching trending topic...`);
    topic = await getTrendingTopic();
    if (!topic)
      throw new Error("Trending topic discovery returned empty result.");
    console.log(`[${requestId}] [Step 1] Topic Selected: "${topic}"`);

    // STEP 2: AI Blog Generation (Groq)
    console.log(`[${requestId}] [Step 2] Generating blog via Groq...`);
    blogData = await generateBlog(topic);
    if (!blogData || !blogData.title)
      throw new Error("Groq failed to return valid blog structure.");
    console.log(`[${requestId}] [Step 2] Blog Generated: "${blogData.title}"`);

    // STEP 3: AI Image Generation (Stability AI with Fallback)
    console.log(`[${requestId}] [Step 3] Generating cover image...`);
    try {
      const generatedImageUrl = await generateImage(
        blogData.image?.prompt || blogData.title,
      );
      if (generatedImageUrl) {
        finalImageUrl = generatedImageUrl;
        console.log(`[${requestId}] [Step 3] Image Generated Successfully.`);
      } else {
        console.warn(
          `[${requestId}] [Step 3] Image generation returned null. Using fallback.`,
        );
      }
    } catch (imageError: any) {
      console.error(
        `[${requestId}] [Step 3 Failure] Image pipeline crashed:`,
        imageError.message,
      );
    }

    // STEP 4: Database Persistence (Supabase)
    console.log(`[${requestId}] [Step 4] Saving post to Supabase...`);
    const postPayload = {
      ...blogData,
      slug: blogData.slug,
      meta_description: blogData.meta_description,
      focus_keyword: blogData.focus_keyword,
      secondary_keywords: blogData.secondary_keywords,
      faq: blogData.faq,
      image_url: finalImageUrl,
      published: true,
      created_at: new Date().toISOString(),
    };

    const savedPost = await createPost(postPayload);
    if (!savedPost)
      throw new Error("Database operation failed to return saved record.");

    // --- ON-DEMAND REVALIDATION (The Secret Sauce) ---
    // This tells Next.js to clear the cache for these pages immediately
    try {
      revalidatePath("/");
      revalidatePath(`/blog/${savedPost.slug}`);
      console.log(
        `[${requestId}] [Cache] Revalidation triggered for / and /blog/${savedPost.slug}`,
      );
    } catch (cacheError) {
      console.warn(
        `[${requestId}] [Cache Warning] Revalidation failed but post was saved.`,
        cacheError,
      );
    }

    console.log(`[${requestId}] === PIPELINE COMPLETED SUCCESSFULLY ===`);

    return NextResponse.json({
      success: true,
      data: {
        id: savedPost.id,
        title: savedPost.title,
        slug: savedPost.slug,
        image_url: finalImageUrl,
      },
    });
  } catch (pipelineError: any) {
    const failureSource = pipelineError.message.includes("Groq")
      ? "Groq"
      : pipelineError.message.includes("Database")
        ? "Supabase"
        : pipelineError.message.includes("Topic")
          ? "Trending Lib"
          : "Orchestrator";

    console.error(
      `[${requestId}] [!] CRITICAL PIPELINE FAILURE at ${failureSource}:`,
      pipelineError.message,
    );

    return NextResponse.json(
      {
        success: false,
        error: pipelineError.message,
        source: failureSource,
        requestId,
      },
      { status: 500 },
    );
  }
}

/**
 * EXPORT BOTH GET AND POST TO SUPPORT EXTERNAL CRON SERVICES
 */
export async function GET(request: Request) {
  return orchestrateGeneration(request);
}

export async function POST(request: Request) {
  return orchestrateGeneration(request);
}
