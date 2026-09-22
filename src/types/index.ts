/**
 * Shared domain types for the platform.
 * Keep public API DTOs separate from Prisma models so private fields stay private.
 */

export type { PublicBicycleDetail, OwnerBicycleListItem } from "@/types/bicycle";

export type PublicBicycleStatus = "ACTIVE" | "STOLEN" | "TRANSFERRED" | "ARCHIVED";

/** Intentionally excludes email, phone, and address. */
export type PublicOwnerSummary = {
  displayName: string | null;
};
