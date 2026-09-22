import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Fingerprint of the generated datamodel. After `prisma generate`, a hot-reloaded
 * Next.js process must not reuse a PrismaClient built against a stale schema
 * (classic cause of PrismaClientValidationError for newly added fields).
 */
const prismaSchemaFingerprint = Prisma.dmmf.datamodel.models
  .map((model) => `${model.name}:${model.fields.map((field) => field.name).join(",")}`)
  .join("|");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaFingerprint?: string;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma &&
  globalForPrisma.prismaSchemaFingerprint === prismaSchemaFingerprint
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaFingerprint = prismaSchemaFingerprint;
}
