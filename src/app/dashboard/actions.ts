"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  StatusTransitionError,
  markBicycleAsRecovered,
  markBicycleAsStolen,
} from "@/lib/bicycles";
import { findOrCreateUserFromClerk } from "@/lib/users";
import { markBicycleStolenSchema } from "@/lib/validations/bicycle";

export type StatusActionResult = {
  ok: boolean;
  message: string;
};

async function requireOwnerForStatusAction(
  bicycleId: string,
): Promise<
  | { ok: true; userId: string; bicycleId: string }
  | { ok: false; result: StatusActionResult }
> {
  const session = await auth();

  if (!session.userId) {
    return {
      ok: false,
      result: {
        ok: false,
        message: "Энэ дугуйн төлөвийг өөрчлөх эрх танд байхгүй байна.",
      },
    };
  }

  const parsed = markBicycleStolenSchema.safeParse({ bicycleId });
  if (!parsed.success) {
    return {
      ok: false,
      result: { ok: false, message: "Дугуй олдсонгүй." },
    };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return {
      ok: false,
      result: {
        ok: false,
        message: "Энэ дугуйн төлөвийг өөрчлөх эрх танд байхгүй байна.",
      },
    };
  }

  const user = await findOrCreateUserFromClerk(clerkUser);
  return { ok: true, userId: user.id, bicycleId: parsed.data.bicycleId };
}

function mapStatusError(
  error: unknown,
  invalidMessage: string,
): StatusActionResult {
  if (error instanceof StatusTransitionError) {
    if (error.code === "NOT_FOUND") {
      return { ok: false, message: "Дугуй олдсонгүй." };
    }
    if (error.code === "FORBIDDEN") {
      return {
        ok: false,
        message: "Энэ дугуйн төлөвийг өөрчлөх эрх танд байхгүй байна.",
      };
    }
    if (error.code === "INVALID_STATE") {
      return { ok: false, message: invalidMessage };
    }
  }

  return {
    ok: false,
    message: "Үйлдлийг гүйцэтгэхэд алдаа гарлаа. Дахин оролдоно уу.",
  };
}

function revalidateBicyclePaths(bicycleId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/bikes/search");
  revalidatePath(`/bikes/${bicycleId}`);
}

/**
 * Authenticated owner-only ACTIVE → STOLEN transition.
 */
export async function markBicycleStolenAction(
  bicycleId: string,
): Promise<StatusActionResult> {
  try {
    const gate = await requireOwnerForStatusAction(bicycleId);
    if (!gate.ok) {
      return gate.result;
    }

    await markBicycleAsStolen(gate.userId, gate.bicycleId);
    revalidateBicyclePaths(gate.bicycleId);

    return {
      ok: true,
      message: "Дугуйг хулгайд алдсан гэж бүртгэлээ.",
    };
  } catch (error) {
    return mapStatusError(
      error,
      "Энэ дугуй аль хэдийн хулгайд алдсан гэж бүртгэгдсэн байна.",
    );
  }
}

/**
 * Authenticated owner-only STOLEN → ACTIVE (recovered) transition.
 */
export async function markBicycleRecoveredAction(
  bicycleId: string,
): Promise<StatusActionResult> {
  try {
    const gate = await requireOwnerForStatusAction(bicycleId);
    if (!gate.ok) {
      return gate.result;
    }

    await markBicycleAsRecovered(gate.userId, gate.bicycleId);
    revalidateBicyclePaths(gate.bicycleId);

    return {
      ok: true,
      message: "Дугуйг олдсон / буцаан авсан гэж бүртгэлээ.",
    };
  } catch (error) {
    return mapStatusError(
      error,
      "Зөвхөн хулгайд алдсан гэж бүртгэгдсэн дугуйг буцаан идэвхжүүлэх боломжтой.",
    );
  }
}

/** @deprecated Alias kept for older imports */
export type MarkStolenActionResult = StatusActionResult;
