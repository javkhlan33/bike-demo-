import { Prisma } from "@prisma/client";

/**
 * True when MongoDB rejected credentials (SCRAM bad auth),
 * as opposed to schema/query logic errors.
 */
export function isDatabaseAuthError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) &&
      !(error instanceof Prisma.PrismaClientUnknownRequestError) &&
      !(error instanceof Prisma.PrismaClientInitializationError)) {
    const message = error instanceof Error ? error.message : String(error);
    return /AuthenticationFailed|bad auth|authentication failed/i.test(message);
  }

  const message = error.message;
  return /AuthenticationFailed|bad auth|authentication failed/i.test(message);
}
