import type { BicycleStatus, BicycleType } from "@prisma/client";

/**
 * Strict public bicycle DTO.
 * Never includes qrCodeToken, owner fields, PII, serial photo, or MongoDB id.
 */
export type PublicBicycleDetail = {
  brand: string;
  model: string;
  bicycleType: BicycleType;
  year: number | null;
  frameSize: string | null;
  wheelSize: string | null;
  color: string | null;
  status: BicycleStatus;
  registeredAt: Date;
  certificateNumber: string;
  sidePhotoUrl: string | null;
};

/**
 * Authenticated owner dashboard row.
 * May include serial photo access path — never qrCodeToken / clerkId.
 */
export type OwnerBicycleListItem = {
  id: string;
  brand: string;
  model: string;
  bicycleType: BicycleType;
  status: BicycleStatus;
  serialNumber: string;
  certificateNumber: string;
  year: number | null;
  frameSize: string | null;
  wheelSize: string | null;
  color: string | null;
  purchaseDate: Date | null;
  description: string | null;
  registeredAt: Date;
  sidePhotoUrl: string | null;
  hasSerialPhoto: boolean;
};

/** Fields safe to select for public bicycle reads. */
export const publicBicycleSelect = {
  brand: true,
  model: true,
  bicycleType: true,
  year: true,
  frameSize: true,
  wheelSize: true,
  color: true,
  status: true,
  createdAt: true,
  certificateNumber: true,
  sidePhotoUrl: true,
} as const;

/** Fields safe to select for authenticated owner lists. */
export const ownerBicycleSelect = {
  id: true,
  brand: true,
  model: true,
  bicycleType: true,
  status: true,
  serialNumber: true,
  certificateNumber: true,
  year: true,
  frameSize: true,
  wheelSize: true,
  color: true,
  purchaseDate: true,
  description: true,
  createdAt: true,
  sidePhotoUrl: true,
  serialPhotoPublicId: true,
} as const;

export type PublicBicycleRecord = {
  brand: string;
  model: string;
  bicycleType: BicycleType;
  year: number | null;
  frameSize: string | null;
  wheelSize: string | null;
  color: string | null;
  status: BicycleStatus;
  createdAt: Date;
  certificateNumber: string | null;
  sidePhotoUrl: string | null;
};

export type OwnerBicycleRecord = {
  id: string;
  brand: string;
  model: string;
  bicycleType: BicycleType;
  status: BicycleStatus;
  serialNumber: string;
  certificateNumber: string | null;
  year: number | null;
  frameSize: string | null;
  wheelSize: string | null;
  color: string | null;
  purchaseDate: Date | null;
  description: string | null;
  createdAt: Date;
  sidePhotoUrl: string | null;
  serialPhotoPublicId: string | null;
};

export function toPublicBicycleDetail(
  bicycle: PublicBicycleRecord & { certificateNumber: string },
): PublicBicycleDetail {
  return {
    brand: bicycle.brand,
    model: bicycle.model,
    bicycleType: bicycle.bicycleType,
    year: bicycle.year,
    frameSize: bicycle.frameSize,
    wheelSize: bicycle.wheelSize,
    color: bicycle.color,
    status: bicycle.status,
    registeredAt: bicycle.createdAt,
    certificateNumber: bicycle.certificateNumber,
    sidePhotoUrl: bicycle.sidePhotoUrl,
  };
}

export function toOwnerBicycleListItem(
  bicycle: OwnerBicycleRecord & { certificateNumber: string },
): OwnerBicycleListItem {
  return {
    id: bicycle.id,
    brand: bicycle.brand,
    model: bicycle.model,
    bicycleType: bicycle.bicycleType,
    status: bicycle.status,
    serialNumber: bicycle.serialNumber,
    certificateNumber: bicycle.certificateNumber,
    year: bicycle.year,
    frameSize: bicycle.frameSize,
    wheelSize: bicycle.wheelSize,
    color: bicycle.color,
    purchaseDate: bicycle.purchaseDate,
    description: bicycle.description,
    registeredAt: bicycle.createdAt,
    sidePhotoUrl: bicycle.sidePhotoUrl,
    hasSerialPhoto: Boolean(bicycle.serialPhotoPublicId),
  };
}

/** JSON-safe public search payload (no id, serial, or secrets). */
export type PublicBicycleSearchPayload = Omit<
  PublicBicycleDetail,
  "registeredAt"
> & {
  registeredAt: string;
};

export type BicycleSearchApiResponse =
  | {
      ok: true;
      found: true;
      bicycle: PublicBicycleSearchPayload;
    }
  | {
      ok: true;
      found: false;
      bicycle: null;
    }
  | {
      ok: false;
      found: false;
      bicycle: null;
      message: string;
    };

export function toPublicBicycleSearchPayload(
  bicycle: PublicBicycleDetail,
): PublicBicycleSearchPayload {
  return {
    brand: bicycle.brand,
    model: bicycle.model,
    bicycleType: bicycle.bicycleType,
    year: bicycle.year,
    frameSize: bicycle.frameSize,
    wheelSize: bicycle.wheelSize,
    color: bicycle.color,
    status: bicycle.status,
    registeredAt: bicycle.registeredAt.toISOString(),
    certificateNumber: bicycle.certificateNumber,
    sidePhotoUrl: bicycle.sidePhotoUrl,
  };
}
