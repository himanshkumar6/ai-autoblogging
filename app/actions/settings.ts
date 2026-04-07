"use server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

/**
 * Retrieves a single setting asynchronously from the database.
 * Usually executed server-side to hide API secrets.
 */
export async function getSetting<T>(key: string): Promise<T | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return null;
    return data.value as T;
  } catch (err) {
    console.error(`Error reading setting ${key}:`, err);
    return null;
  }
}

/**
 * Retrieves all stored settings as a key-value dictionary.
 */
export async function getAllSettings() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("settings")
      .select("key, value");

    if (error || !data) return {};

    const settingsMap: Record<string, any> = {};
    data.forEach((row: any) => {
      settingsMap[row.key] = row.value;
    });

    return settingsMap;
  } catch (err) {
    console.error("Error fetching all settings:", err);
    return {};
  }
}

/**
 * Saves or updates a dictionary of settings directly to the database.
 * Uses an upsert operation handling conflict resolution natively over the 'key' column.
 */
export async function saveSettings(payload: Record<string, any>) {
  try {
    const supabase = getSupabaseAdmin();
    const keys = Object.keys(payload);
    
    if (keys.length === 0) return { success: true };

    const upserts = keys.map((key) => ({
      key: key,
      value: payload[key],
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from("settings")
      .upsert(upserts, { onConflict: "key" });

    if (error) {
      console.error("Failed to save settings:", error);
      return { success: false, error: error.message };
    }

    // Force Next.js router cache to clear globally so layouts load new ad codes/GA instantly
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (err: any) {
    console.error("System crash while saving settings:", err);
    return { success: false, error: err.message || "Unknown server error" };
  }
}
