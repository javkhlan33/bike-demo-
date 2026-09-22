import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { generateUniqueCertificateNumber } from "@/lib/certificate";
import { prisma } from "@/lib/prisma";
import { generateVerificationQrSvg } from "@/lib/qr";
import { getBicycleVerificationUrl } from "@/lib/site-config";
import type { RegisterBicycleInput } from "@/lib/validations/bicycle";
import {
  ownerBicycleSelect,
  publicBicycleSelect,
  toOwnerBicycleListItem,
  toPublicBicycleDetail,
  type OwnerBicycleListItem,
  type PublicBicycleDetail,
} from "@/types/bicycle";

export type RegistrationErrorCode =
  | "DUPLICATE_SERIAL"
  | "QR_TOKEN_COLLISION"
  | "CERTIFICATE_COLLISION"
  | "DATABASE_ERROR";

export class RegistrationError extends Error {
  code: RegistrationErrorCode;

  constructor(code: RegistrationErrorCode, message?: string) {
    super(message ?? code);
    this.name = "RegistrationError";
    this.code = code;
  }
}

async function generateUniqueQrToken(
  tx: Prisma.TransactionClient = prisma,
): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const token = randomBytes(16).toString("hex");
    const existing = await tx.bicycle.findUnique({
      where: { qrCodeToken: token },
      select: { id: true },
    });
    if (!existing) {
      return token;
    }
  }

  throw new RegistrationError("QR_TOKEN_COLLISION");
}

/**
 * Assign certificate numbers to existing bicycles missing one.
 * Does not touch qrCodeToken, ownership, or status.
 * Mongo may omit the field entirely (not store explicit null).
 */
export async function backfillMissingCertificateNumbers(): Promise<number> {
  const bicycles = await prisma.bicycle.findMany({
    select: { id: true, certificateNumber: true },
  });

  const missing = bicycles.filter((bike) => !bike.certificateNumber);
  let assigned = 0;

  for (const bike of missing) {
    await prisma.$transaction(async (tx) => {
      const fresh = await tx.bicycle.findUnique({
        where: { id: bike.id },
        select: { certificateNumber: true },
      });
      if (fresh?.certificateNumber) {
        return;
      }

      const certificateNumber = await generateUniqueCertificateNumber(tx);
      await tx.bicycle.update({
        where: { id: bike.id },
        data: { certificateNumber },
        select: { id: true },
      });
    });
    assigned += 1;
  }

  return assigned;
}

async function ensureCertificateNumber(
  bicycleId: string,
  current: string | null,
): Promise<string> {
  if (current) {
    return current;
  }

  return prisma.$transaction(async (tx) => {
    const fresh = await tx.bicycle.findUnique({
      where: { id: bicycleId },
      select: { certificateNumber: true },
    });

    if (fresh?.certificateNumber) {
      return fresh.certificateNumber;
    }

    const certificateNumber = await generateUniqueCertificateNumber(tx);
    await tx.bicycle.update({
      where: { id: bicycleId },
      data: { certificateNumber },
      select: { id: true },
    });
    return certificateNumber;
  });
}

export type RegisteredBicycleResult = {
  id: string;
};

export type RegisterBicyclePhotos = {
  sidePhotoPublicId?: string;
  sidePhotoUrl?: string;
  serialPhotoPublicId?: string;
};

/**
 * Create a Bicycle + initial OwnershipRecord for the authenticated MongoDB user.
 * Returns only the public route id — never qrCodeToken or owner fields.
 */
export async function registerBicycleForUser(
  ownerId: string,
  input: RegisterBicycleInput,
  photos: RegisterBicyclePhotos = {},
): Promise<RegisteredBicycleResult> {
  const existingSerial = await prisma.bicycle.findUnique({
    where: { serialNumber: input.serialNumber },
    select: { id: true },
  });

  if (existingSerial) {
    throw new RegistrationError("DUPLICATE_SERIAL");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const qrCodeToken = await generateUniqueQrToken(tx);
      const certificateNumber = await generateUniqueCertificateNumber(tx);

      const bicycle = await tx.bicycle.create({
        data: {
          serialNumber: input.serialNumber,
          certificateNumber,
          brand: input.brand,
          model: input.model,
          bicycleType: input.bicycleType,
          year: input.year,
          frameSize: input.frameSize,
          wheelSize: input.wheelSize,
          color: input.color,
          purchaseDate: input.purchaseDate,
          description: input.description,
          imagePublicIds: [
            photos.sidePhotoPublicId,
            photos.serialPhotoPublicId,
          ].filter((id): id is string => Boolean(id)),
          sidePhotoPublicId: photos.sidePhotoPublicId,
          sidePhotoUrl: photos.sidePhotoUrl,
          serialPhotoPublicId: photos.serialPhotoPublicId,
          status: "ACTIVE",
          qrCodeToken,
          currentOwnerId: ownerId,
        },
        select: { id: true },
      });

      await tx.ownershipRecord.create({
        data: {
          bicycleId: bicycle.id,
          ownerId,
          changeType: "REGISTRATION",
          notes: "Initial registration",
        },
      });

      return bicycle;
    });
  } catch (error) {
    if (error instanceof RegistrationError) {
      throw error;
    }

    if (error instanceof Error && error.message === "CERTIFICATE_COLLISION") {
      throw new RegistrationError("CERTIFICATE_COLLISION");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;
      const fields = Array.isArray(target)
        ? target.map(String)
        : [String(target ?? "")];
      if (fields.some((field) => field.includes("serialNumber"))) {
        throw new RegistrationError("DUPLICATE_SERIAL");
      }
      if (fields.some((field) => field.includes("qrCodeToken"))) {
        throw new RegistrationError("QR_TOKEN_COLLISION");
      }
      if (fields.some((field) => field.includes("certificateNumber"))) {
        throw new RegistrationError("CERTIFICATE_COLLISION");
      }
    }

    throw new RegistrationError("DATABASE_ERROR");
  }
}

/**
 * Public bicycle lookup — selects only privacy-safe fields.
 * Never loads qrCodeToken, currentOwnerId, serialNumber, or relations.
 */
export async function getPublicBicycleById(
  id: string,
): Promise<PublicBicycleDetail | null> {
  const bicycle = await prisma.bicycle.findUnique({
    where: { id },
    select: { ...publicBicycleSelect, id: true },
  });

  if (!bicycle) {
    return null;
  }

  const certificateNumber = await ensureCertificateNumber(
    bicycle.id,
    bicycle.certificateNumber,
  );

  return toPublicBicycleDetail({ ...bicycle, certificateNumber });
}

/**
 * Authenticated owner list — no qrCodeToken / clerkId / owner PII.
 * Lazily backfills certificate numbers for legacy rows.
 */
export async function listBicyclesForOwner(
  ownerId: string,
): Promise<OwnerBicycleListItem[]> {
  await backfillMissingCertificateNumbers();

  const bicycles = await prisma.bicycle.findMany({
    where: { currentOwnerId: ownerId },
    orderBy: { createdAt: "desc" },
    select: ownerBicycleSelect,
  });

  return bicycles.map((bicycle) => {
    if (!bicycle.certificateNumber) {
      throw new Error("CERTIFICATE_MISSING");
    }
    return toOwnerBicycleListItem({
      ...bicycle,
      certificateNumber: bicycle.certificateNumber,
    });
  });
}

/**
 * Public exact serial lookup via unique index.
 */
export async function findPublicBicycleBySerial(
  normalizedSerial: string,
): Promise<PublicBicycleDetail | null> {
  const bicycle = await prisma.bicycle.findUnique({
    where: { serialNumber: normalizedSerial },
    select: { ...publicBicycleSelect, id: true },
  });

  if (!bicycle) {
    return null;
  }

  const certificateNumber = await ensureCertificateNumber(
    bicycle.id,
    bicycle.certificateNumber,
  );

  return toPublicBicycleDetail({ ...bicycle, certificateNumber });
}

/**
 * Public QR verification lookup via unique qrCodeToken index.
 */
export async function findPublicBicycleByQrToken(
  token: string,
): Promise<PublicBicycleDetail | null> {
  const bicycle = await prisma.bicycle.findUnique({
    where: { qrCodeToken: token },
    select: { ...publicBicycleSelect, id: true },
  });

  if (!bicycle) {
    return null;
  }

  const certificateNumber = await ensureCertificateNumber(
    bicycle.id,
    bicycle.certificateNumber,
  );

  return toPublicBicycleDetail({ ...bicycle, certificateNumber });
}

/**
 * Generate QR SVG for a bicycle owned by the authenticated user.
 */
export async function getOwnedBicycleQrSvg(
  ownerId: string,
  bicycleId: string,
): Promise<string | null> {
  const bicycle = await prisma.bicycle.findFirst({
    where: {
      id: bicycleId,
      currentOwnerId: ownerId,
    },
    select: {
      qrCodeToken: true,
    },
  });

  if (!bicycle) {
    return null;
  }

  const verificationUrl = getBicycleVerificationUrl(bicycle.qrCodeToken);
  return generateVerificationQrSvg(verificationUrl);
}

export type StatusTransitionErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "INVALID_STATE"
  | "DATABASE_ERROR";

export class StatusTransitionError extends Error {
  code: StatusTransitionErrorCode;

  constructor(code: StatusTransitionErrorCode, message?: string) {
    super(message ?? code);
    this.name = "StatusTransitionError";
    this.code = code;
  }
}

/** @deprecated Use StatusTransitionError */
export class StolenStatusError extends StatusTransitionError {
  constructor(code: StatusTransitionErrorCode, message?: string) {
    super(code, message);
    this.name = "StolenStatusError";
  }
}

async function diagnoseStatusTransitionFailure(
  ownerId: string,
  bicycleId: string,
): Promise<never> {
  const bicycle = await prisma.bicycle.findUnique({
    where: { id: bicycleId },
    select: {
      currentOwnerId: true,
      status: true,
    },
  });

  if (!bicycle) {
    throw new StatusTransitionError("NOT_FOUND");
  }

  if (bicycle.currentOwnerId !== ownerId) {
    throw new StatusTransitionError("FORBIDDEN");
  }

  throw new StatusTransitionError("INVALID_STATE");
}

/**
 * ACTIVE → STOLEN for the authenticated current owner only.
 * Writes BicycleStatusHistory. Does not create OwnershipRecord.
 */
export async function markBicycleAsStolen(
  ownerId: string,
  bicycleId: string,
): Promise<void> {
  try {
    const updated = await prisma.$transaction(async (tx) => {
      const bicycle = await tx.bicycle.findFirst({
        where: {
          id: bicycleId,
          currentOwnerId: ownerId,
          status: "ACTIVE",
        },
        select: { id: true },
      });

      if (!bicycle) {
        return 0;
      }

      await tx.bicycle.update({
        where: { id: bicycle.id },
        data: { status: "STOLEN" },
        select: { id: true },
      });

      await tx.bicycleStatusHistory.create({
        data: {
          bicycleId: bicycle.id,
          fromStatus: "ACTIVE",
          toStatus: "STOLEN",
          reason: "STOLEN_REPORTED",
        },
      });

      return 1;
    });

    if (updated === 1) {
      return;
    }

    await diagnoseStatusTransitionFailure(ownerId, bicycleId);
  } catch (error) {
    if (error instanceof StatusTransitionError) {
      throw error;
    }

    throw new StatusTransitionError("DATABASE_ERROR");
  }
}

/**
 * STOLEN → ACTIVE (recovered) for the authenticated current owner only.
 * Writes BicycleStatusHistory. Does not create OwnershipRecord.
 */
export async function markBicycleAsRecovered(
  ownerId: string,
  bicycleId: string,
): Promise<void> {
  try {
    const updated = await prisma.$transaction(async (tx) => {
      const bicycle = await tx.bicycle.findFirst({
        where: {
          id: bicycleId,
          currentOwnerId: ownerId,
          status: "STOLEN",
        },
        select: { id: true },
      });

      if (!bicycle) {
        return 0;
      }

      await tx.bicycle.update({
        where: { id: bicycle.id },
        data: { status: "ACTIVE" },
        select: { id: true },
      });

      await tx.bicycleStatusHistory.create({
        data: {
          bicycleId: bicycle.id,
          fromStatus: "STOLEN",
          toStatus: "ACTIVE",
          reason: "BICYCLE_RECOVERED",
        },
      });

      return 1;
    });

    if (updated === 1) {
      return;
    }

    await diagnoseStatusTransitionFailure(ownerId, bicycleId);
  } catch (error) {
    if (error instanceof StatusTransitionError) {
      throw error;
    }

    throw new StatusTransitionError("DATABASE_ERROR");
  }
}

export type BicycleEditErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "DATABASE_ERROR"
  | "CLOUDINARY_ERROR";

export class BicycleEditError extends Error {
  code: BicycleEditErrorCode;

  constructor(code: BicycleEditErrorCode, message?: string) {
    super(message ?? code);
    this.name = "BicycleEditError";
    this.code = code;
  }
}

async function requireOwnedBicycle(ownerId: string, bicycleId: string) {
  const bicycle = await prisma.bicycle.findUnique({
    where: { id: bicycleId },
    select: {
      id: true,
      currentOwnerId: true,
      sidePhotoPublicId: true,
      serialPhotoPublicId: true,
    },
  });

  if (!bicycle) {
    throw new BicycleEditError("NOT_FOUND");
  }
  if (bicycle.currentOwnerId !== ownerId) {
    throw new BicycleEditError("FORBIDDEN");
  }

  return bicycle;
}

/**
 * Owner-only bicycle info update.
 * Never changes qrCodeToken, certificateNumber, status, or ownership.
 */
export async function updateBicycleDetailsForOwner(
  ownerId: string,
  bicycleId: string,
  input: Omit<RegisterBicycleInput, "serialNumber">,
): Promise<void> {
  await requireOwnedBicycle(ownerId, bicycleId);

  try {
    await prisma.bicycle.update({
      where: { id: bicycleId },
      data: {
        brand: input.brand,
        model: input.model,
        bicycleType: input.bicycleType,
        year: input.year ?? null,
        frameSize: input.frameSize ?? null,
        wheelSize: input.wheelSize ?? null,
        color: input.color ?? null,
        purchaseDate: input.purchaseDate ?? null,
        description: input.description ?? null,
      },
      select: { id: true },
    });
  } catch (error) {
    if (error instanceof BicycleEditError) {
      throw error;
    }
    throw new BicycleEditError("DATABASE_ERROR");
  }
}

export async function updateOwnedSidePhoto(
  ownerId: string,
  bicycleId: string,
  photo: { publicId: string; url: string } | null,
): Promise<void> {
  const bicycle = await requireOwnedBicycle(ownerId, bicycleId);
  const previousId = bicycle.sidePhotoPublicId;

  try {
    await prisma.bicycle.update({
      where: { id: bicycleId },
      data: {
        sidePhotoPublicId: photo?.publicId ?? null,
        sidePhotoUrl: photo?.url ?? null,
      },
      select: { id: true },
    });
  } catch {
    throw new BicycleEditError("DATABASE_ERROR");
  }

  if (previousId && previousId !== photo?.publicId) {
    const { destroyBicyclePhoto } = await import("@/lib/cloudinary");
    await destroyBicyclePhoto(previousId, "side");
  }
}

export async function updateOwnedSerialPhoto(
  ownerId: string,
  bicycleId: string,
  photo: { publicId: string } | null,
): Promise<void> {
  const bicycle = await requireOwnedBicycle(ownerId, bicycleId);
  const previousId = bicycle.serialPhotoPublicId;

  try {
    await prisma.bicycle.update({
      where: { id: bicycleId },
      data: {
        serialPhotoPublicId: photo?.publicId ?? null,
      },
      select: { id: true },
    });
  } catch {
    throw new BicycleEditError("DATABASE_ERROR");
  }

  if (previousId && previousId !== photo?.publicId) {
    const { destroyBicyclePhoto } = await import("@/lib/cloudinary");
    await destroyBicyclePhoto(previousId, "serial");
  }
}

/**
 * Owner-only serial photo publicId lookup for signed delivery.
 */
export async function getOwnedSerialPhotoPublicId(
  ownerId: string,
  bicycleId: string,
): Promise<string | null> {
  const bicycle = await prisma.bicycle.findFirst({
    where: {
      id: bicycleId,
      currentOwnerId: ownerId,
    },
    select: {
      serialPhotoPublicId: true,
    },
  });

  return bicycle?.serialPhotoPublicId ?? null;
}
