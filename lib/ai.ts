import { getSetting } from "@/app/actions/settings";
import { generateWithGemini } from "./gemini";
import { generateWithChatGPT } from "./openai";
import { generateWithClaude, normalizeJsonResponse } from "./claude";
import { logStep } from "./logger";

/**
 * Centralized AI Orchestrator with Fallback Logic.
 * Flow: Gemini (Primary) -> OpenAI -> Claude (Final)
 */
export async function generateContent(prompt: string) {
  // 0. Pre-flight check: Is at least one provider active?
  const geminiEnabled = await getSetting<boolean>("gemini_enabled");
  const openaiEnabled = await getSetting<boolean>("openai_enabled");
  const claudeEnabled = await getSetting<boolean>("claudeEnabled") !== false;

  if (!geminiEnabled && !openaiEnabled && !claudeEnabled) {
    throw new Error("Pipeline Aborted: No AI providers are enabled in Settings.");
  }

  // 1. Try Gemini (Primary)
  const geminiKey = await getSetting<string>("gemini_api_key") || process.env.GEMINI_API_KEY;

  if (geminiEnabled && geminiKey) {
    try {
      console.log("[AI Orchestrator] Attempting Primary Engine: Gemini...");
      const result = await generateWithGemini(prompt, geminiKey);
      logStep("generate", "success", "Generated using Gemini", { provider: "gemini" });
      return JSON.parse(result);
    } catch (error: any) {
      console.error(`[AI Orchestrator] Gemini failed: ${error.message}`);
      logStep("generate", "fail", `Gemini failed: ${error.message}`, { provider: "gemini" });
      // Fallback continues...
    }
  } else {
    console.log("[AI Orchestrator] Skipping Gemini: Provider disabled or key missing.");
  }

  // 2. Try OpenAI (Secondary)
  const openaiKey = await getSetting<string>("openai_api_key") || process.env.OPENAI_API_KEY;

  if (openaiEnabled && openaiKey) {
    try {
      console.log("[AI Orchestrator] Attempting Secondary Engine: OpenAI...");
      const result = await generateWithChatGPT(prompt, openaiKey);
      logStep("generate", "success", "Generated using OpenAI", { provider: "openai" });
      return JSON.parse(result);
    } catch (error: any) {
      console.error(`[AI Orchestrator] OpenAI failed: ${error.message}`);
      logStep("generate", "fail", `OpenAI failed: ${error.message}`, { provider: "openai" });
      // Fallback continues...
    }
  } else {
    console.log("[AI Orchestrator] Skipping OpenAI: Provider disabled or key missing.");
  }

  // 3. Try Claude (Final Fallback)
  if (claudeEnabled) {
    try {
      console.log("[AI Orchestrator] Attempting Final Fallback: Claude...");
      const result = await generateWithClaude(prompt);
      logStep("generate", "success", "Generated using Claude", { provider: "claude" });
      return result; 
    } catch (error: any) {
      console.error(`[AI Orchestrator] Claude failed: ${error.message}`);
      logStep("generate", "fail", `Claude failed: ${error.message}`, { provider: "claude" });
    }
  } else {
    console.log("[AI Orchestrator] Skipping Claude: Provider disabled.");
  }

  throw new Error("Autonomous Failure: All enabled AI providers exhausted their attempts.");
}
