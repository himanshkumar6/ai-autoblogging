import { createClient } from "@supabase/supabase-js";

/**
 * SERVER CLIENT: Lazy-initialized singleton for administrative use
 * Uses SERVICE_ROLE_KEY - NEVER import this in client components
 */
let adminSupabase = null;

export function getServerSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    if (typeof window === "undefined") {
      console.error("❌ Supabase Admin credentials missing! Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    }
  }

  if (!adminSupabase) {
    adminSupabase = createClient(url, key);
  }
  return adminSupabase;
}

/**
 * Standard client for public/client-side use
 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(url, key);
}

/**
 * Generate a URL-friendly slug from title
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Insert a new post into Supabase
 * @param {Object} blogData - The data returned from Groq generator
 */
export async function createPost(blogData) {
  const { title, meta_description, content, tags, image_url, published = true } = blogData;
  
  // Robust Slug Generation
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
    
  if (!slug) slug = "market-update-" + Date.now();

  console.log(`[Supabase] Saving post to database: ${title} (Slug: ${slug})`);

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          slug,
          meta_description,
          content,
          image_url,
          published,
          status: "published",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation on slug
      if (error.code === "23505") {
        console.warn("[Supabase] Slug collision, retrying with new suffix...");
        const newSlug = `${slug}-${Math.floor(Math.random() * 10000)}`;
        return await supabase
          .from("posts")
          .insert([{ ...blogData, slug: newSlug, status: "published", published: true }])
          .select()
          .single();
      }
      throw error;
    }

    console.log(`[Supabase] Successfully saved post. ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error(`[Supabase] DB Insert Failed: ${error.message}`);
    throw error;
  }
}
