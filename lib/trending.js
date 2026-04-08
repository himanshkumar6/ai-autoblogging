/**
 * Fetch trending topics from Hugging Face or fallback to a curated list.
 */

const FALLBACK_TOPICS = [
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
 * uses the public API to discover popular models/datasets
 */
export async function getTrendingTopic() {
  console.log("[Trending] Fetching topics from custom HF Space: technoeddie-ai-autoblogging...");
  
  try {
    const response = await fetch("https://technoeddie-ai-autoblogging.hf.space/trending");
    
    if (!response.ok) {
      throw new Error(`HF Space responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === "success" && data.topics && data.topics.length > 0) {
      // Pick a random topic from the returned list
      const randomIndex = Math.floor(Math.random() * data.topics.length);
      const selected = data.topics[randomIndex];
      
      // Use the pre-suggested blog_title if available, otherwise the topic text
      const topic = selected.blog_title || selected.topic;

      console.log(`[Trending] Found custom topic: ${topic}`);
      return topic;
    } else {
      throw new Error("Invalid response format from custom HF Space");
    }

  } catch (error) {
    console.error(`[Trending] Failed to fetch custom topics: ${error.message}`);
    console.log("[Trending] Using local fallback topic list...");
    
    const fallbackTopic = FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
    console.log(`[Trending] Fallback topic: ${fallbackTopic}`);
    
    return fallbackTopic;
  }
}
