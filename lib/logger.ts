import { getSupabaseAdmin } from "./supabase-admin";

/**
 * Valid known steps for the pipeline logging system.
 */
export type StepType = 
  | "trend" 
  | "research" 
  | "outline" 
  | "generate" 
  | "generate_image"
  | "save" 
  | "tweet";

/**
 * Non-blocking logger for system steps.
 * Uses a fire-and-forget approach to avoid slowing down the main pipeline.
 * Allows valid StepType values, while allowing fallback arbitrary strings safely.
 */
export function logStep(
  step: StepType | (string & {}),
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
