/**
 * Google Gemini REST API Implementation with Model Fallback
 * Priority: 1.5-flash -> 1.5-pro -> 1.0-pro (Guaranteed)
 */
export async function generateWithGemini(prompt: string, apiKey: string) {
  if (!apiKey) throw new Error("Gemini API key is required");

  // Fallback bucket
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[Gemini Attempt] Model: ${model}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      // If Not Found (404), try the next model in the bucket
      if (response.status === 404) {
        console.warn(`[Gemini Fallback] Model ${model} not found (404). Trying next...`);
        lastError = new Error(`Model ${model} not found`);
        continue; 
      }

      // Handle other API errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Gemini Error] ${model}:`, errorText);
        throw new Error(`Gemini API Error: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!text) {
        throw new Error(`Gemini (${model}) returned an empty response`);
      }

      return normalizeAIOutput(text);

    } catch (err: any) {
      if (err.message.includes("not found")) continue; // Explicitly handled
      throw err; // For other errors like invalid key, re-throw to allow provider fallback
    }
  }

  throw lastError || new Error("All Gemini models failed or were not found.");
}

/**
 * Clean AI output (remove markdown blocks)
 */
function normalizeAIOutput(text: string): string {
  return text
    .replace(/^```[a-z]*\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();
}
