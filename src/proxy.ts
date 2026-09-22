import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16+ uses proxy.ts (replaces middleware.ts) for Clerk.
 * Route protection is enforced in pages/handlers via auth helpers.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
