import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Require an authenticated Clerk session.
 * Use in server components / route handlers that need a signed-in user.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session.userId) {
    return session.redirectToSignIn();
  }

  return session;
}

/**
 * Return the current Clerk user, or null when signed out.
 */
export async function getCurrentClerkUser() {
  return currentUser();
}
