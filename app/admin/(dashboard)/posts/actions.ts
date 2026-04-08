"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = [
  "admin@cryptonews.local",
  process.env.ADMIN_EMAIL || ""
].filter(Boolean);

/**
 * Basic security check for Server Actions
 */
async function isAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && ADMIN_EMAILS.includes(user.email || "");
}

/**
 * Delete a post from the database
 */
export async function deletePost(id: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;

    console.log(`[Admin Actions] Deleted post: ${id}`);
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error: any) {
    console.error(`[Admin Actions] Delete failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Update a post's content and generate a new slug if needed
 */
export async function updatePost(id: string, formData: { title: string; meta_description: string; content: string }) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    const { title, meta_description, content } = formData;
    
    // Generate a new unique slug based on title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Math.floor(Math.random() * 1000);

    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from("posts")
      .update({
        title,
        meta_description,
        content,
        slug,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    console.log(`[Admin Actions] Updated post: ${id}`);
    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${id}/edit`);
    return { success: true, post: data };
  } catch (error: any) {
    console.error(`[Admin Actions] Update failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}
