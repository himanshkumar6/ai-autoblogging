/**
 * Fetch trending topics from Hugging Face or fallback to a curated list.
 */

export interface TrendingTopic {
  topic: string;
  blog_title: string;
  category: string;
  keyword: string;
  slug?: string;
  summary?: string;
}

const FALLBACK_TOPICS: string[] = [
  "Future of Large Language Models in 2026",
  "How AI is Revolutionizing Personal Productivity",
  "The Rise of Open Source AI: Llama 3 and Beyond",
  "Machine Learning Trends for Software Engineers",
  "Ethical AI: Navigating the Challenges of Automation",
  "AI Agents: The Next Frontier of Web Development",
  "Zero-Shot Learning: Explained for Beginners"
];

/**
 * Get a trending topic from Hugging Face Hub
 */
export async function getTrendingTopic(): Promise<TrendingTopic> {
  console.log("[Trending] Fetching topics from custom HF Space: technoeddie-ai-autoblogging...");
  
  try {
    const response = await fetch("https://technoeddie-ai-autoblogging.hf.space/trending", {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`HF Space responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === "success" && data.topics && data.topics.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.topics.length);
      const selected = data.topics[randomIndex];
      
      console.log(`[Trending] Found custom topic: ${selected.blog_title || selected.topic} (Category: ${selected.category})`);
      return selected;
    } else {
      throw new Error("Invalid response format from custom HF Space");
    }

  } catch (error: any) {
    console.error(`[Trending] Failed to fetch custom topics: ${error.message}`);
    
    const fallbackTopic = FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
    const fallbackObject: TrendingTopic = {
      topic: fallbackTopic,
      blog_title: fallbackTopic,
      category: fallbackTopic.toLowerCase().includes("ai") ? "tech" : "general",
      keyword: "ai news"
    };

    return fallbackObject;
  }
}
