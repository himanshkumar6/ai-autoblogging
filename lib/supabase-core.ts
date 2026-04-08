import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * CLIENT-SIDE SUPABASE: Lazy-initialized singleton for public use
 * This ensuring process.env is only accessed at runtime.
 */
let publicSupabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (publicSupabase) return publicSupabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      throw new Error("Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
    }
    // Return a placeholder client during build time static analysis if env is missing
    return createClient('https://placeholder.supabase.co', 'placeholder')
  }

  publicSupabase = createClient(supabaseUrl, supabaseKey)
  return publicSupabase
}

/**
 * SERVER CLIENT: Lazy-initialized singleton for administrative use
 * Uses SERVICE_ROLE_KEY - NEVER import this in client components
 */
let adminSupabase: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    if (typeof window === "undefined" && process.env.NODE_ENV === 'production') {
      console.error("❌ Supabase Admin credentials missing! Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    }
    // Return placeholder for build safety
    return createClient('https://placeholder.supabase.co', 'placeholder')
  }

  if (!adminSupabase) {
    adminSupabase = createClient(url, key);
  }
  return adminSupabase;
}

/**
 * Generate a URL-friendly slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Insert a new post into Supabase
 * @param {any} blogData - The data returned from Groq generator
 */
export async function createPost(blogData: any) {
  const { title, meta_description, content, image_url, published = true } = blogData;
  
  // Robust Slug Generation
  let slug = generateSlug(title);
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

    console.log(`[Supabase] Successfully saved post. ID: ${data?.id}`);
    return data;
  } catch (error: any) {
    console.error(`[Supabase] DB Insert Failed: ${error.message}`);
    throw error;
  }
}
