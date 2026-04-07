/**
 * OpenAI GPT-4 Turbo REST API Implementation.
 * No SDK dependency. 
 */
export async function generateWithChatGPT(prompt: string, apiKey: string) {
  if (!apiKey) throw new Error("OpenAI API key is required");

  const url = "https://api.openai.com/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an API that outputs strictly JSON. Do not output anything other than parsable JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error: ${errorText || response.statusText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("OpenAI returned an empty or malformed response");
  }

  return normalizeAIOutput(text);
}

/**
 * Ensures AI output is clean HTML/JSON.
 * Removes markdown backticks (```json, ```html, etc.) and extra whitespace.
 */
function normalizeAIOutput(text: string): string {
  return text
    .replace(/^```[a-z]*\n?/i, "") // Remove opening code blocks
    .replace(/\n?```$/i, "") // Remove closing code blocks
    .trim();
}
