import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

export type BicyclePhotoKind = "side" | "serial";

const FOLDERS: Record<BicyclePhotoKind, string> = {
  side: "bike-mn/bicycles/side",
  serial: "bike-mn/bicycles/serial",
};

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_BICYCLE_PHOTO_BYTES = 8 * 1024 * 1024;

/**
 * Cloudinary configuration — secrets stay server-side only.
 */
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
} as const;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    cloudinaryConfig.cloudName &&
      cloudinaryConfig.apiKey &&
      cloudinaryConfig.apiSecret,
  );
}

function assertConfigured() {
  if (!isCloudinaryConfigured()) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
    secure: true,
  });
}

export function validateBicyclePhotoFile(file: File): string | null {
  if (!(file instanceof File) || file.size === 0) {
    return "Зураг олдсонгүй.";
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return "Зөвхөн JPEG, PNG, WebP зураг оруулна уу.";
  }
  if (file.size > MAX_BICYCLE_PHOTO_BYTES) {
    return "Зургийн хэмжээ 8MB-аас хэтрэхгүй байх ёстой.";
  }
  return null;
}

export type UploadedBicyclePhoto = {
  publicId: string;
  /** Public delivery URL (side photos). Empty for private serial uploads. */
  url: string;
};

/**
 * Upload a bicycle photo. Side = public delivery. Serial = authenticated.
 */
export async function uploadBicyclePhoto(
  file: File,
  kind: BicyclePhotoKind,
): Promise<UploadedBicyclePhoto> {
  assertConfigured();

  const validationError = validateBicyclePhotoFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = FOLDERS[kind];
  const accessMode = kind === "serial" ? "authenticated" : "public";

  const result = await new Promise<{
    public_id: string;
    secure_url: string;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          type: accessMode === "authenticated" ? "authenticated" : "upload",
          overwrite: true,
          unique_filename: true,
          transformation:
            kind === "side"
              ? [{ width: 1600, crop: "limit", quality: "auto", fetch_format: "auto" }]
              : [{ width: 2000, crop: "limit", quality: "auto:best" }],
        },
        (error, uploaded) => {
          if (error || !uploaded?.public_id) {
            reject(error ?? new Error("UPLOAD_FAILED"));
            return;
          }
          resolve({
            public_id: uploaded.public_id,
            secure_url: uploaded.secure_url,
          });
        },
      )
      .end(buffer);
  });

  if (kind === "serial") {
    return { publicId: result.public_id, url: "" };
  }

  return {
    publicId: result.public_id,
    url: buildSidePhotoDeliveryUrl(result.public_id),
  };
}

export function buildSidePhotoDeliveryUrl(publicId: string): string {
  assertConfigured();
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width: 1200, crop: "limit", quality: "auto", fetch_format: "auto" },
    ],
  });
}

/**
 * Short-lived signed URL for private serial evidence. Server-only.
 */
export function buildSerialPhotoSignedUrl(publicId: string): string {
  assertConfigured();
  return cloudinary.url(publicId, {
    type: "authenticated",
    sign_url: true,
    secure: true,
    transformation: [
      { width: 1600, crop: "limit", quality: "auto:best", fetch_format: "auto" },
    ],
  });
}

export async function destroyBicyclePhoto(
  publicId: string | null | undefined,
  kind: BicyclePhotoKind,
): Promise<void> {
  if (!publicId || !isCloudinaryConfigured()) {
    return;
  }

  assertConfigured();

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: kind === "serial" ? "authenticated" : "upload",
    });
  } catch {
    // Best-effort cleanup — do not fail the owner action.
  }
}

/** Stable cache-buster for owner image previews (no secrets). */
export function photoRevisionToken(publicId: string | null | undefined): string {
  if (!publicId) {
    return "0";
  }
  return createHash("sha256").update(publicId).digest("hex").slice(0, 10);
}
