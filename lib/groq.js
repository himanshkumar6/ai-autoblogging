import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Clean and parse JSON from Groq response
 * Handles potential markdown code blocks or leading/trailing text
 */
const safeJsonParse = (text) => {
  try {
    // 1. Remove markdown code blocks if present (```json ... ```)
    const cleanedText = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.warn("[Groq] Direct JSON parse failed, attempting regex extraction...");
    
    // 2. Try to extract JSON between first '{' and last '}'
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        throw new Error("Failed to extract valid JSON from response");
      }
    }
    throw error;
  }
};

/**
 * Generate SEO blog post content using Groq
 * @param {string} topic - The trending topic
 * @param {number} retries - Internal retry counter
 */
export async function generateBlog(topic, retries = 3) {
  const prompt = `
    You are an expert SEO content creator and tech blogger.
    Generate a high-quality, SEO-optimized blog post for the topic: "${topic}".
    
    The response MUST be in strict JSON format with the following structure:
    {
      "title": "Compelling Title",
      "meta_description": "SEO meta description (max 160 chars)",
      "content": "Full blog content in HTML format. Use H1 for title, H2 for subheadings, and <p> for paragraphs. No markdown.",
      "tags": ["tag1", "tag2", "tag3"]
    }

    Strict Rules:
    - Respond ONLY with the JSON object.
    - Title should be catchy and include keywords.
    - Content should be at least 600 words.
    - Use HTML tags (H1, H2, P, STRONG) inside the "content" field.
    - Do not include any apology or extra text.
  `;

  try {
    console.log(`[Groq] Generating blog for topic: ${topic} (Retries left: ${retries})`);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a specialized JSON generator that writes technical blog posts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" }, // Groq supports JSON mode
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) throw new Error("Empty response from Groq");

    const parsedData = safeJsonParse(responseText);
    
    // Validate required fields
    if (!parsedData.title || !parsedData.content) {
      throw new Error("Missing required fields in AI response");
    }

    console.log(`[Groq] Successfully generated blog: ${parsedData.title}`);
    return parsedData;

  } catch (error) {
    console.error(`[Groq] Error: ${error.message}`);
    
    if (retries > 0) {
      const waitTime = (4 - retries) * 2000; // Exponential backoffish
      console.log(`[Groq] Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return generateBlog(topic, retries - 1);
    }
    
    throw new Error(`Groq Pipeline Failed: ${error.message}`);
  }
}
