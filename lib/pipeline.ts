import { revalidatePath } from "next/cache";
import { getTrendingTopic } from "@/lib/trending";
import { generateBlog } from "@/lib/groq";
import { generateImage } from "@/lib/image";
import { createPost } from "@/lib/supabase-core";

/**
 * CORE PIPELINE LOGIC
 * Can be called by API routes or Server Actions
 */
export async function runAutoPipeline() {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] === STARTING CONTEXT-AWARE PIPELINE ===`);

  try {
    // STEP 1: Trending Topic Discovery
    console.log(`[${requestId}] [Step 1] Fetching trending topic...`);
    const topicData = await getTrendingTopic();
    if (!topicData) throw new Error("Trending topic discovery returned empty result.");
    
    const selectedTopic = topicData.blog_title || topicData.topic;
    console.log(`[${requestId}] [Step 1] Topic Selected: "${selectedTopic}" (Category: ${topicData.category})`);

    // STEP 2: AI Blog Generation
    console.log(`[${requestId}] [Step 2] Generating AI Content...`);
    const blogData = await generateBlog(topicData);
    if (!blogData || !blogData.title) throw new Error("AI failed to return valid blog structure.");

    // STEP 3: Image Generation
    console.log(`[${requestId}] [Step 3] Generating cover image...`);
    let finalImageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475";
    try {
      const generatedImageUrl = await generateImage(blogData.image?.prompt || blogData.title);
      if (generatedImageUrl) finalImageUrl = generatedImageUrl;
    } catch (e) {
      console.warn("Image generation failed, using fallback.");
    }

    // STEP 4: Save to Database
    console.log(`[${requestId}] [Step 4] Finalizing database entry...`);
    const postPayload = {
      ...blogData,
      image_url: finalImageUrl,
      published: true,
      created_at: new Date().toISOString(),
    };

    const savedPost = await createPost(postPayload);
    if (!savedPost) throw new Error("Database save failed.");

    console.log(`[${requestId}] [Success] Post saved with ID: ${savedPost.id}`);

    return {
      success: true,
      data: {
        id: savedPost.id,
        title: savedPost.title,
        slug: savedPost.slug,
        image_url: finalImageUrl,
      }
    };
  } catch (error: any) {
    console.error(`[${requestId}] PIPELINE CRITICAL FAILURE:`, error.message);
    return { success: false, error: error.message };
  }
}
