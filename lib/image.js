import { supabase } from "./supabase.js";

const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80";

export async function generateImage(prompt, negativePrompt, retries = 2) {
  try {
    console.log(`[Image] Generating image... Retries left: ${retries}`);
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      }),
    });

    if (!response.ok) {
      // Often model is loading, etc.
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const imageBlob = await response.blob();
    
    // Check if the response was actually a JSON error masquerading as a blob
    if (imageBlob.type === 'application/json') {
      const errorJson = JSON.parse(await imageBlob.text());
      throw new Error(`HF returned JSON error: ${errorJson.error || JSON.stringify(errorJson)}`);
    }

    const fileName = `generated-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    console.log(`[Image] Uploading to Supabase Storage: ${fileName}`);
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("blog-images")
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Supabase upload error: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from("blog-images")
      .getPublicUrl(fileName);

    console.log(`[Image] Successfully generated and uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`[Image] Error: ${error.message}`);
    if (retries > 0) {
      console.log(`[Image] Retrying...`);
      const waitTime = (3 - retries) * 5000; // wait longer for HF model loading
      await new Promise(res => setTimeout(res, waitTime));
      return generateImage(prompt, negativePrompt, retries - 1);
    }
    console.warn(`[Image] Failing back to default image.`);
    return FALLBACK_IMAGE;
  }
}
