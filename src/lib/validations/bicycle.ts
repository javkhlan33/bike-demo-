import { z } from "zod";

export const BICYCLE_TYPE_VALUES = [
  "MTB",
  "ROAD",
  "GRAVEL",
  "BMX",
  "CITY",
  "FOLDING",
  "EBIKE",
  "KIDS",
  "OTHER",
] as const;

export type BicycleTypeValue = (typeof BICYCLE_TYPE_VALUES)[number];

export const BICYCLE_TYPE_LABELS: Record<BicycleTypeValue, string> = {
  MTB: "MTB",
  ROAD: "Road",
  GRAVEL: "Gravel",
  BMX: "BMX",
  CITY: "City",
  FOLDING: "Folding",
  EBIKE: "E-bike",
  KIDS: "Kids",
  OTHER: "Other",
};

export const BICYCLE_STATUS_LABELS = {
  ACTIVE: "Идэвхтэй",
  STOLEN: "Хулгайд алдсан",
  TRANSFERRED: "Шилжүүлсэн",
  ARCHIVED: "Архивласан",
} as const;

const validationMessage = "Оруулсан мэдээллээ шалгана уу.";

const optionalText = () =>
  z.string().transform((value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });

export const registerBicycleSchema = z.object({
  brand: z.string().trim().min(1, validationMessage),
  model: z.string().trim().min(1, validationMessage),
  bicycleType: z.enum(BICYCLE_TYPE_VALUES, {
    message: validationMessage,
  }),
  serialNumber: z
    .string()
    .trim()
    .min(1, validationMessage)
    .transform((value) => value.toUpperCase()),
  year: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return value;
  }, z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1).optional()),
  frameSize: optionalText(),
  wheelSize: optionalText(),
  color: optionalText(),
  purchaseDate: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    return value;
  }, z.coerce.date().optional()),
  description: optionalText(),
});

export type RegisterBicycleInput = z.infer<typeof registerBicycleSchema>;

/** Owner edit — same fields as registration except serial (immutable). */
export const updateBicycleSchema = registerBicycleSchema.omit({
  serialNumber: true,
});

export type UpdateBicycleInput = z.infer<typeof updateBicycleSchema>;

export function formDataToUpdateInput(formData: FormData) {
  return {
    brand: String(formData.get("brand") ?? ""),
    model: String(formData.get("model") ?? ""),
    bicycleType: String(formData.get("bicycleType") ?? ""),
    year: String(formData.get("year") ?? ""),
    frameSize: String(formData.get("frameSize") ?? ""),
    wheelSize: String(formData.get("wheelSize") ?? ""),
    color: String(formData.get("color") ?? ""),
    purchaseDate: String(formData.get("purchaseDate") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}
export function normalizeSerialNumberForSearch(value: string): string {
  return value.trim().toUpperCase();
}

export const searchSerialSchema = z.object({
  serial: z
    .string()
    .trim()
    .min(1, validationMessage)
    .transform((value) => normalizeSerialNumberForSearch(value)),
});

export type SearchSerialInput = z.infer<typeof searchSerialSchema>;

/**
 * Validate QR path token shape before DB lookup.
 * Does not log or echo the token.
 */
export const qrVerificationTokenSchema = z
  .string()
  .trim()
  .min(16, validationMessage)
  .max(128, validationMessage)
  .regex(/^[a-zA-Z0-9_-]+$/, validationMessage);

export type QrVerificationToken = z.infer<typeof qrVerificationTokenSchema>;

/** MongoDB ObjectId string used for authenticated owner actions. */
export const bicycleIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, validationMessage);

export const markBicycleStolenSchema = z.object({
  bicycleId: bicycleIdSchema,
});

export type MarkBicycleStolenInput = z.infer<typeof markBicycleStolenSchema>;

export function formDataToRegisterInput(formData: FormData) {
  return {
    brand: String(formData.get("brand") ?? ""),
    model: String(formData.get("model") ?? ""),
    bicycleType: String(formData.get("bicycleType") ?? ""),
    serialNumber: String(formData.get("serialNumber") ?? ""),
    year: String(formData.get("year") ?? ""),
    frameSize: String(formData.get("frameSize") ?? ""),
    wheelSize: String(formData.get("wheelSize") ?? ""),
    color: String(formData.get("color") ?? ""),
    purchaseDate: String(formData.get("purchaseDate") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}
