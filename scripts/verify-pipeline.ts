const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "your_secret_here";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function testGeneratePost() {
  console.log("--- Testing /api/generate-post ---");
  try {
    const response = await fetch(`${BASE_URL}/api/generate-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({ topic: "Testing AI Pipeline Integrity" }),
    });

    console.log(`Status: ${response.status}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log("Success! Generated Post Title:", data.title);
      console.log("Content Length:", data.content?.length);
      return true;
    } else {
      console.error("Failed:", data.error);
      return false;
    }
  } catch (err: any) {
    console.error("Fetch Error:", err.message);
    return false;
  }
}

async function testAutoRun() {
  console.log("\n--- Testing /api/auto-run (GET) ---");
  try {
    const response = await fetch(`${BASE_URL}/api/auto-run`, {
      method: "GET",
      // auto-run doesn't currently require a secret in the GET header, 
      // but it uses it INTERNALLY for sub-requests.
    });

    console.log(`Status: ${response.status}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log("Success! Pipeline completed for topic:", data.topic);
      console.log("Slug created:", data.slug);
      return true;
    } else {
      console.error("Failed:", data.error);
      return false;
    }
  } catch (err: any) {
    console.error("Fetch Error:", err.message);
    return false;
  }
}

async function runTests() {
  console.log("Starting Pipeline Verification...");
  const postOk = await testGeneratePost();
  if (!postOk) {
    console.log("Skipping Auto-Run test due to post generation failure.");
    return;
  }
  await testAutoRun();
}

runTests();
