import { getServerSupabase } from "./supabase-core";

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/core";
const POLLINATIONS_API_URL = "https://image.pollinations.ai/prompt/";

/**
 * PRIMARY: Stability AI (Premium)
 */
async function generateStabilityImage(prompt) {
  if (!process.env.STABILITY_API_KEY) {
    throw new Error("STABILITY_API_KEY missing");
  }

  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("aspect_ratio", "16:9");
  formData.append("output_format", "png");
  formData.append("negative_prompt", "blurry, low quality, distorted, text, watermark, logo, bad anatomy");

  const response = await fetch(STABILITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
      "Accept": "image/*",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`Stability Error (${response.status}): ${errorText}`);
    error.status = response.status;
    throw error;
  }

  return await response.blob();
}

/**
 * FALLBACK: Pollinations AI (Free / Unlimited)
 */
async function generateFreeImage(prompt) {
  console.log("=== POLLINATIONS FALLBACK TRIGGERED ===");
  
  // Clean prompt for URL
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `${POLLINATIONS_API_URL}${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000000)}&model=flux`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pollinations Error (${response.status})`);
  }

  return await response.blob();
}

/**
 * ORCHESTRATOR: Stability -> Pollinations Fallback
 */
export async function generateImage(prompt) {
  try {
    console.log("=== AI IMAGE GENERATION TRIGGERED ===");
    console.log("PROMPT:", prompt);

    let imageBlob;
    let provider = "STABILITY";

    try {
      console.log("=== ATTEMPTING STABILITY AI (PREMIUM) ===");
      imageBlob = await generateStabilityImage(prompt);
    } catch (stabError) {
      // 401 (Unauthorized) or 402 (Payment Required) or 429 (Rate Limit) -> Fallback
      if (stabError.status === 401 || stabError.status === 402 || stabError.status === 429) {
        console.warn(`[Image] Stability Credits/Access Issue (${stabError.status}). Switching to Free fallback...`);
        imageBlob = await generateFreeImage(prompt);
        provider = "POLLINATIONS";
      } else {
        // Other errors (like 500) we might still want to try fallback
        console.warn(`[Image] Stability API failed (${stabError.message}). Attempting fallback...`);
        imageBlob = await generateFreeImage(prompt);
        provider = "POLLINATIONS";
      }
    }
    
    // Safety check for empty blobs
    if (!imageBlob || imageBlob.size < 1000) {
      throw new Error("Received invalid/empty image from all providers");
    }

    // 4. Upload to Supabase Storage
    const supabase = getServerSupabase();
    const fileName = `${provider.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    console.log(`[Image] Uploading to Supabase (${provider}): ${fileName} (${imageBlob.size} bytes)`);

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("blog-images")
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) throw new Error(`Supabase Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = supabase
      .storage
      .from("blog-images")
      .getPublicUrl(fileName);

    console.log(`✅ AI IMAGE GENERATED SUCCESSFULLY (${provider})`);
    return publicUrl;

  } catch (error) {
    console.error(`[Image Orchestrator Critical Failure] ${error.message}`);
    return null;
  }
}
