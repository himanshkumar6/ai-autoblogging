import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const safeJsonParse = (text) => {
  try {
    const cleanedText = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.warn("[Groq] Direct JSON parse failed, attempting regex extraction...");
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

export async function generateBlog(topicData, retries = 3) {
  const today = new Date().toISOString().split("T")[0];
  const topicTitle = typeof topicData === 'string' ? topicData : (topicData.blog_title || topicData.topic);
  const category = (topicData.category || "general").toLowerCase();

  // Dynamic Persona Mapping
  let persona = "world-class investigative journalist, SEO strategist, and expert content writer";
  let nicheTitle = "news article";
  let industry = "industry";

  if (category.includes("crypto") || category.includes("bullish") || category.includes("bearish") || category.includes("price")) {
    persona = "world-class crypto journalist, pro-level technical analyst, and SEO strategist";
    nicheTitle = "crypto news article";
    industry = "cryptocurrency market";
  } else if (category.includes("nasa") || category.includes("space") || category.includes("mars") || category.includes("moon") || category.includes("launch")) {
    persona = "world-class NASA science correspondent, space exploration expert, and SEO strategist";
    nicheTitle = "space discovery report";
    industry = "space exploration and science";
  } else if (category.includes("tech") || category.includes("ai")) {
    persona = "world-class technology analyst, AI researcher, and SEO strategist";
    nicheTitle = "tech insight article";
    industry = "technology sector";
  }

  const prompt = `
You are a ${persona}.
Today's date: ${today}
Topic: "${topicTitle}"
Category: "${category}"

Your job is to generate a COMPLETE, FULLY SEO-OPTIMIZED ${nicheTitle}.
Respond ONLY with a valid JSON object. No extra text, no markdown, no apology.

JSON structure:
{
  "title": "SEO title — max 60 chars, include primary keyword near the start",
  "slug": "url-friendly-slug-with-primary-keyword",
  "meta_description": "Compelling meta description, 140-155 chars, include primary keyword and a call to action",
  "focus_keyword": "single most important keyword phrase",
  "secondary_keywords": ["keyword2", "keyword3", "keyword4", "keyword5"],
  "content": "FULL ARTICLE IN HTML — see rules below",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "faq": [
    { "question": "Question with keyword?", "answer": "Concise 2-3 sentence answer." },
    { "question": "Another common user question?", "answer": "Helpful answer." },
    { "question": "Third relevant question?", "answer": "Clear answer." }
  ],
  "image": {
    "prompt": "Highly detailed cinematic 16:9 illustration. ${category.includes('space') ? 'Epic cosmic perspective.' : ''} EXPLICITLY show the subject of: '${topicTitle}'. Professional, sharp focus, 8k, cinematic lighting.",
    "negative_prompt": "blurry, low quality, text, watermark, logo, distorted, abstract motherboard"
  },
  "schema_type": "NewsArticle",
  "reading_time_minutes": 5
}

CONTENT HTML RULES (strictly follow):
- Start with <h1> containing the focus keyword
- Write a strong 2-paragraph introduction — include focus keyword in first 100 words
- Use at least 6 <h2> sections, each minimum 200 words — each h2 should contain a secondary keyword variation
- Use <h3> inside sections where needed for sub-points
- Each section minimum 150 words
- Total article minimum 1500 words, target 2000 words
- Use <strong> to bold important terms/keywords naturally (not spammy)
- Add a <ul> or <ol> list in at least 2 sections
- End with a <h2>Conclusion</h2> section summarizing key points
- After conclusion add FAQ as: <div class="faq-section"><h2>Frequently Asked Questions</h2> with <h3> per question and <p> per answer
- NO markdown, ONLY clean HTML
- Write in active voice, conversational but authoritative tone
- Naturally mention the focus keyword every 200-300 words (no keyword stuffing)
- Ensure the content is highly relevant to the ${industry} and ${category} category.
`;

  try {
    console.log(`[Groq] Generating SEO blog for [${category.toUpperCase()}]: "${topicTitle}" (Retries left: ${retries})`);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a specialized JSON generator. You write expert-level SEO ${nicheTitle}s for the ${industry}. Always return pure valid JSON only.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) throw new Error("Empty response from Groq");

    const parsedData = safeJsonParse(responseText);

    if (!parsedData.title || !parsedData.content) {
      throw new Error("Missing required fields in AI response");
    }

    console.log(`[Groq] Blog generated: "${parsedData.title}"`);
    return parsedData;

  } catch (error) {
    console.error(`[Groq] Error: ${error.message}`);

    if (retries > 0) {
      const waitTime = (4 - retries) * 2000;
      console.log(`[Groq] Retrying in ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return generateBlog(topicData, retries - 1);
    }

    throw new Error(`Groq Pipeline Failed: ${error.message}`);
  }
}