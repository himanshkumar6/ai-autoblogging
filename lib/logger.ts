import { getSupabaseAdmin } from "./supabase-admin";

/**
 * Non-blocking logger for system steps.
 * Uses a fire-and-forget approach to avoid slowing down the main pipeline.
 */
export function logStep(
  step: "trend" | "research" | "outline" | "generate" | "save" | "tweet",
  status: "success" | "fail",
  message?: string,
  metadata: Record<string, any> = {}
) {
  const supabase = getSupabaseAdmin();

  // Fire and forget - Do not await this in the main thread
  (async () => {
    try {
      const { error } = await supabase
        .from("system_logs")
        .insert([
          {
            step,
            status,
            message: message?.substring(0, 500), // Keep messages concise
            metadata,
          },
        ]);
      
      if (error) {
        console.error(`[Logger Error] Failed to write log for ${step}:`, error.message);
      }
    } catch (err: any) {
      console.error(`[Logger Exception] ${step}:`, err);
    }
  })();
}
