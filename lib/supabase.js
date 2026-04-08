import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase credentials missing! Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { title, meta_description, content, tags, image_url } = blogData;
  const slug = `${generateSlug(title)}-${Math.floor(Math.random() * 1000)}`;

  console.log(`[Supabase] Saving post to database: ${title} (Slug: ${slug})`);

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          slug,
          meta_description,
          content,
          tags,
          image_url,
          status: "published",
          published: true,
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
