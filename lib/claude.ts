import Anthropic from "@anthropic-ai/sdk";
import { getSetting } from "@/app/actions/settings";

/**
 * Parses and normalizes the AI output to reliably extract clean JSON
 * even if the model rudely answers with Markdown formatting blocks.
 */
export function normalizeJsonResponse(text: string) {
  // Strip Markdown JSON codeblocks
  let cleanText = text.trim();
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.substring(3);
  }
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.slice(0, -3);
  }
  
  return JSON.parse(cleanText.trim());
}

export async function getClaudeConfig() {
  const claudeApiKey = await getSetting<string>("claudeApiKey");
  const claudeModel = await getSetting<string>("claudeModel") || "claude-3-haiku-20240307";
  const claudeEnabled = await getSetting<boolean>("claudeEnabled");
  
  return { claudeApiKey, claudeModel, claudeEnabled };
}

export async function generateWithClaude(prompt: string) {
  const { claudeApiKey, claudeModel } = await getClaudeConfig();
  
  if (!claudeApiKey) {
    throw new Error("Claude API key not found in storage.");
  }

  const anthropic = new Anthropic({ apiKey: claudeApiKey });

  const response = await anthropic.messages.create({
    model: claudeModel,
    max_tokens: 3000,
    temperature: 0.7,
    system: "You are an API that outputs strictly parseable JSON. Do not output conversational text or markdown codeblock wrappers.",
    messages: [
      { role: "user", content: prompt }
    ]
  });

  const outputText = response.content[0].type === "text" ? response.content[0].text : "";
  return normalizeJsonResponse(outputText);
}
