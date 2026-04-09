"use server";

import { runAutoPipeline } from "@/lib/pipeline";

/**
 * Server Action to trigger the autonomous pipeline securely.
 * This keeps the ADMIN_TOKEN on the server side (not needed for internal call)
 * and avoids the overhead/timeout of an internal fetch.
 */
export async function triggerAutoRun() {
  try {
    const result = await runAutoPipeline();
    return result;
  } catch (err: any) {
    console.error("Failed to trigger auto-run:", err);
    return { success: false, error: "Direct pipeline execution failed." };
  }
}
