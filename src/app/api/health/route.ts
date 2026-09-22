import { NextResponse } from "next/server";
import { isClerkConfigured, isDatabaseConfigured } from "@/lib/env";

/**
 * Lightweight readiness endpoint for ops / Vercel diagnosis.
 * Reports only whether required env vars are configured — never their values.
 */
export async function GET() {
  const databaseConfigured = isDatabaseConfigured();
  const clerkConfigured = isClerkConfigured();

  return NextResponse.json({
    ok: databaseConfigured && clerkConfigured,
    databaseConfigured,
    clerkConfigured,
  });
}
