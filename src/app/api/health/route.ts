import { NextResponse } from "next/server";

/**
 * Lightweight readiness endpoint for future mobile / ops checks.
 * Does not expose secrets or private user data.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "bike-mn",
    timestamp: new Date().toISOString(),
  });
}
