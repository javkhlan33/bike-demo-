import { randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";

/** Crockford-like alphabet — avoids ambiguous 0/O/1/I. */
const CERT_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Public-safe certificate number: BMN-XXXX-XXXX
 * Not derived from MongoDB ObjectId or qrCodeToken.
 */
export function formatCertificateNumber(partA: string, partB: string): string {
  return `BMN-${partA}-${partB}`;
}

function randomCertSegment(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += CERT_ALPHABET[bytes[i]! % CERT_ALPHABET.length]!;
  }
  return out;
}

export function createCertificateNumberCandidate(): string {
  return formatCertificateNumber(randomCertSegment(4), randomCertSegment(4));
}

export async function generateUniqueCertificateNumber(
  tx: Prisma.TransactionClient,
): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = createCertificateNumberCandidate();
    const existing = await tx.bicycle.findUnique({
      where: { certificateNumber: candidate },
      select: { id: true },
    });
    if (!existing) {
      return candidate;
    }
  }

  throw new Error("CERTIFICATE_COLLISION");
}
