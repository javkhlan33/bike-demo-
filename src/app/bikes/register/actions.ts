"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect, unstable_rethrow } from "next/navigation";
import { RegistrationError, registerBicycleForUser } from "@/lib/bicycles";
import {
  isCloudinaryConfigured,
  uploadBicyclePhoto,
  validateBicyclePhotoFile,
} from "@/lib/cloudinary";
import { findOrCreateUserFromClerk } from "@/lib/users";
import {
  formDataToRegisterInput,
  registerBicycleSchema,
} from "@/lib/validations/bicycle";

export type RegisterBicycleState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerBicycleAction(
  _prevState: RegisterBicycleState,
  formData: FormData,
): Promise<RegisterBicycleState> {
  const session = await auth();

  if (!session.userId) {
    return {
      ok: false,
      message: "Дугуй бүртгүүлэхийн тулд нэвтэрнэ үү.",
    };
  }

  const parsed = registerBicycleSchema.safeParse(
    formDataToRegisterInput(formData),
  );

  if (!parsed.success) {
    return {
      ok: false,
      message: "Оруулсан мэдээллээ шалгана уу.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return {
      ok: false,
      message: "Дугуй бүртгүүлэхийн тулд нэвтэрнэ үү.",
    };
  }

  const sideFile = formData.get("sidePhoto");
  const serialFile = formData.get("serialPhoto");
  const cloudinaryReady = isCloudinaryConfigured();

  if (cloudinaryReady) {
    if (!(sideFile instanceof File) || sideFile.size === 0) {
      return { ok: false, message: "Дугуйн хажуугийн зураг оруулна уу." };
    }
    if (!(serialFile instanceof File) || serialFile.size === 0) {
      return { ok: false, message: "Серийн дугаарын зураг оруулна уу." };
    }

    const sideError = validateBicyclePhotoFile(sideFile);
    const serialError = validateBicyclePhotoFile(serialFile);
    if (sideError || serialError) {
      return {
        ok: false,
        message: sideError ?? serialError ?? "Зураг буруу байна.",
      };
    }
  }

  try {
    const user = await findOrCreateUserFromClerk(clerkUser);

    let photos:
      | {
          sidePhotoPublicId?: string;
          sidePhotoUrl?: string;
          serialPhotoPublicId?: string;
        }
      | undefined;

    if (
      cloudinaryReady &&
      sideFile instanceof File &&
      serialFile instanceof File
    ) {
      const [side, serial] = await Promise.all([
        uploadBicyclePhoto(sideFile, "side"),
        uploadBicyclePhoto(serialFile, "serial"),
      ]);
      photos = {
        sidePhotoPublicId: side.publicId,
        sidePhotoUrl: side.url,
        serialPhotoPublicId: serial.publicId,
      };
    }

    const bicycle = await registerBicycleForUser(user.id, parsed.data, photos);
    redirect(`/bikes/${bicycle.id}`);
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof RegistrationError) {
      if (error.code === "DUPLICATE_SERIAL") {
        return {
          ok: false,
          message: "Энэ серийн дугаар бүртгэлтэй байна.",
        };
      }

      return {
        ok: false,
        message: "Алдаа гарлаа. Дахин оролдоно уу.",
      };
    }

    if (
      error instanceof Error &&
      error.message === "CLOUDINARY_NOT_CONFIGURED"
    ) {
      return {
        ok: false,
        message: "Зургийн систем тохируулаагүй байна. Админд хандана уу.",
      };
    }

    return {
      ok: false,
      message: "Алдаа гарлаа. Дахин оролдоно уу.",
    };
  }
}
