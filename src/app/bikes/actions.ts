"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  BicycleEditError,
  updateBicycleDetailsForOwner,
  updateOwnedSerialPhoto,
  updateOwnedSidePhoto,
} from "@/lib/bicycles";
import {
  isCloudinaryConfigured,
  uploadBicyclePhoto,
  validateBicyclePhotoFile,
} from "@/lib/cloudinary";
import { findOrCreateUserFromClerk } from "@/lib/users";
import {
  bicycleIdSchema,
  formDataToUpdateInput,
  updateBicycleSchema,
} from "@/lib/validations/bicycle";

export type EditActionResult = {
  ok: boolean;
  message: string;
};

async function requireDbUser() {
  const session = await auth();
  if (!session.userId) {
    return null;
  }
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }
  return findOrCreateUserFromClerk(clerkUser);
}

function revalidateOwnerPaths(bicycleId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/bikes/search");
  revalidatePath(`/bikes/${bicycleId}`);
}

export async function updateBicycleDetailsAction(
  bicycleId: string,
  formData: FormData,
): Promise<EditActionResult> {
  const user = await requireDbUser();
  if (!user) {
    return {
      ok: false,
      message: "Энэ дугуйн мэдээллийг засах эрх танд байхгүй байна.",
    };
  }

  const idParsed = bicycleIdSchema.safeParse(bicycleId);
  if (!idParsed.success) {
    return { ok: false, message: "Дугуй олдсонгүй." };
  }

  const parsed = updateBicycleSchema.safeParse(formDataToUpdateInput(formData));
  if (!parsed.success) {
    return { ok: false, message: "Оруулсан мэдээллээ шалгана уу." };
  }

  try {
    await updateBicycleDetailsForOwner(user.id, idParsed.data, parsed.data);
    revalidateOwnerPaths(idParsed.data);
    return { ok: true, message: "Дугуйн мэдээллийг хадгаллаа." };
  } catch (error) {
    if (error instanceof BicycleEditError) {
      if (error.code === "FORBIDDEN") {
        return {
          ok: false,
          message: "Энэ дугуйн мэдээллийг засах эрх танд байхгүй байна.",
        };
      }
      if (error.code === "NOT_FOUND") {
        return { ok: false, message: "Дугуй олдсонгүй." };
      }
    }
    return {
      ok: false,
      message: "Үйлдлийг гүйцэтгэхэд алдаа гарлаа. Дахин оролдоно уу.",
    };
  }
}

export async function replaceBicycleSidePhotoAction(
  bicycleId: string,
  formData: FormData,
): Promise<EditActionResult> {
  const user = await requireDbUser();
  if (!user) {
    return {
      ok: false,
      message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
    };
  }

  const idParsed = bicycleIdSchema.safeParse(bicycleId);
  if (!idParsed.success) {
    return { ok: false, message: "Дугуй олдсонгүй." };
  }

  if (!isCloudinaryConfigured()) {
    return {
      ok: false,
      message: "Зургийн систем тохируулаагүй байна. Админд хандана уу.",
    };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Зураг сонгоно уу." };
  }

  const validationError = validateBicyclePhotoFile(file);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  try {
    const uploaded = await uploadBicyclePhoto(file, "side");
    await updateOwnedSidePhoto(user.id, idParsed.data, {
      publicId: uploaded.publicId,
      url: uploaded.url,
    });
    revalidateOwnerPaths(idParsed.data);
    return { ok: true, message: "Хажуугийн зургийг шинэчиллээ." };
  } catch (error) {
    if (error instanceof BicycleEditError && error.code === "FORBIDDEN") {
      return {
        ok: false,
        message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
      };
    }
    return {
      ok: false,
      message: "Үйлдлийг гүйцэтгэхэд алдаа гарлаа. Дахин оролдоно уу.",
    };
  }
}

export async function replaceBicycleSerialPhotoAction(
  bicycleId: string,
  formData: FormData,
): Promise<EditActionResult> {
  const user = await requireDbUser();
  if (!user) {
    return {
      ok: false,
      message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
    };
  }

  const idParsed = bicycleIdSchema.safeParse(bicycleId);
  if (!idParsed.success) {
    return { ok: false, message: "Дугуй олдсонгүй." };
  }

  if (!isCloudinaryConfigured()) {
    return {
      ok: false,
      message: "Зургийн систем тохируулаагүй байна. Админд хандана уу.",
    };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Зураг сонгоно уу." };
  }

  const validationError = validateBicyclePhotoFile(file);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  try {
    const uploaded = await uploadBicyclePhoto(file, "serial");
    await updateOwnedSerialPhoto(user.id, idParsed.data, {
      publicId: uploaded.publicId,
    });
    revalidateOwnerPaths(idParsed.data);
    return { ok: true, message: "Серийн дугаарын зургийг шинэчиллээ." };
  } catch (error) {
    if (error instanceof BicycleEditError && error.code === "FORBIDDEN") {
      return {
        ok: false,
        message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
      };
    }
    return {
      ok: false,
      message: "Үйлдлийг гүйцэтгэхэд алдаа гарлаа. Дахин оролдоно уу.",
    };
  }
}

export async function removeBicycleSidePhotoAction(
  bicycleId: string,
): Promise<EditActionResult> {
  const user = await requireDbUser();
  if (!user) {
    return {
      ok: false,
      message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
    };
  }

  const idParsed = bicycleIdSchema.safeParse(bicycleId);
  if (!idParsed.success) {
    return { ok: false, message: "Дугуй олдсонгүй." };
  }

  try {
    await updateOwnedSidePhoto(user.id, idParsed.data, null);
    revalidateOwnerPaths(idParsed.data);
    return { ok: true, message: "Хажуугийн зургийг устгалаа." };
  } catch (error) {
    if (error instanceof BicycleEditError && error.code === "FORBIDDEN") {
      return {
        ok: false,
        message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
      };
    }
    return {
      ok: false,
      message: "Үйлдлийг гүйцэтгэхэд алдаа гарлаа. Дахин оролдоно уу.",
    };
  }
}

export async function removeBicycleSerialPhotoAction(
  bicycleId: string,
): Promise<EditActionResult> {
  const user = await requireDbUser();
  if (!user) {
    return {
      ok: false,
      message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
    };
  }

  const idParsed = bicycleIdSchema.safeParse(bicycleId);
  if (!idParsed.success) {
    return { ok: false, message: "Дугуй олдсонгүй." };
  }

  try {
    await updateOwnedSerialPhoto(user.id, idParsed.data, null);
    revalidateOwnerPaths(idParsed.data);
    return { ok: true, message: "Серийн дугаарын зургийг устгалаа." };
  } catch (error) {
    if (error instanceof BicycleEditError && error.code === "FORBIDDEN") {
      return {
        ok: false,
        message: "Энэ дугуйн зургийг засах эрх танд байхгүй байна.",
      };
    }
    return {
      ok: false,
      message: "Үйлдлийг гүйцэтгэхэд алдаа гарлаа. Дахин оролдоно уу.",
    };
  }
}
