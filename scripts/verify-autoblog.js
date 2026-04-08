const fs = require('fs');
const path = require('path');

/**
 * Manually load .env.local for standalone node execution
 */
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value.length > 0 && !key.startsWith('#')) {
          const val = value.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = val;
        }
      });
    }
  } catch (err) {
    console.warn("Could not load .env.local manually:", err.message);
  }
}

loadEnv();

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "your_admin_token";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function testPipeline() {
  console.log("--- Starting Pipeline Verification Test ---");
  console.log(`URL: ${BASE_URL}/api/auto-generate`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auto-generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ADMIN_TOKEN}`
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Success! Pipeline completed.");
      console.log("Generated Post:", data.post.title);
      console.log("Slug:", data.post.slug);
      console.log("Tags:", data.post.tags.join(", "));
    } else {
      console.error("❌ Failed!");
      console.error("Error:", data.error || data.message);
    }
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
  }
}

testPipeline();
