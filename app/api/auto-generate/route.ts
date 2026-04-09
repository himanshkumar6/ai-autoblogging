import { NextResponse } from "next/server";
import { runAutoPipeline } from "@/lib/pipeline";

// 1. CORE CONFIGURATION
export const dynamic = "force-dynamic";
export const maxDuration = 300;
export const runtime = "nodejs";

/**
 * API Handler for Autonomous Generation
 */
async function handleRequest(request: Request) {
  // 2. AUTHENTICATION SYSTEM
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const adminToken = process.env.ADMIN_TOKEN;

    const isCronTrigger = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const isAdminTrigger = adminToken && authHeader === `Bearer ${adminToken}`;

    if (!isCronTrigger && !isAdminTrigger) {
      return NextResponse.json(
        { error: "Unauthorized. Valid CRON_SECRET or ADMIN_TOKEN required." },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failure" },
      { status: 500 },
    );
  }

  // 3. TRIGGER PIPELINE
  const result = await runAutoPipeline();
  
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}
