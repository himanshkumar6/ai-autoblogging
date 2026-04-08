import { getTrendingTopic } from "../../lib/trending";
import { generateBlog } from "../../lib/groq";
import { createPost } from "../../lib/supabase";

export default async function handler(req, res) {
  // Check if it's a POST request
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // 1. AUTH SECURITY: Admin Token Check
  const authHeader = req.headers.authorization;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
    console.error("[Auth] Unauthorized access attempt.");
    return res.status(401).json({ error: "Unauthorized. Invalid Admin Token." });
  }

  console.log("[Pipeline] Starting automatic blog generation pipeline...");

  try {
    // 2. TRENDING: Get trending topic
    const topic = await getTrendingTopic();
    if (!topic) {
      throw new Error("Could not determine a trending topic.");
    }

    // 3. GENERATION: Generate blog using Groq
    const blogData = await generateBlog(topic);
    if (!blogData) {
      throw new Error("Blog generation failed.");
    }

    // 4. PERSISTENCE: Save to Supabase
    const savedPost = await createPost(blogData);
    if (!savedPost) {
      throw new Error("Saving to database failed.");
    }

    // 5. SUCCESS RESPONE
    console.log("[Pipeline] Pipeline completed successfully.");
    return res.status(200).json({
      success: true,
      message: "Blog generated and saved successfully.",
      post: savedPost,
    });

  } catch (error) {
    console.error(`[Pipeline Error] ${error.message}`);
    
    // Return proper JSON error response
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
