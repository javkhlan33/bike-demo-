import { clerkMiddleware } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { isClerkConfigured } from "@/lib/env";

/**
 * Next.js 16+ uses proxy.ts (replaces middleware.ts) for Clerk.
 * Route protection is enforced in pages/handlers via auth helpers.
 *
 * When Clerk env vars are missing on Vercel, skip clerkMiddleware so the
 * public site does not hard-crash with an opaque Internal Server Error.
 * /api/health remains usable for ops diagnosis either way.
 */
const clerkProxy = clerkMiddleware();

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|api/health|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api(?!/health)|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
