import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOwnedSerialPhotoPublicId } from "@/lib/bicycles";
import {
  buildSerialPhotoSignedUrl,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { findOrCreateUserFromClerk } from "@/lib/users";
import { bicycleIdSchema } from "@/lib/validations/bicycle";

type RouteProps = {
  params: Promise<{ id: string }>;
};

/**
 * Authenticated owner-only serial photo. Redirects to a short-lived signed URL.
 * Never returns public DTO fields or raw Cloudinary secrets.
 */
export async function GET(_request: Request, { params }: RouteProps) {
  try {
    if (!isCloudinaryConfigured()) {
      return new NextResponse("Not configured", { status: 503 });
    }

    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const parsed = bicycleIdSchema.safeParse(id);
    if (!parsed.success) {
      return new NextResponse("Not found", { status: 404 });
    }

    const user = await findOrCreateUserFromClerk(clerkUser);
    const publicId = await getOwnedSerialPhotoPublicId(user.id, parsed.data);

    if (!publicId) {
      return new NextResponse("Not found", { status: 404 });
    }

    const signedUrl = buildSerialPhotoSignedUrl(publicId);

    return NextResponse.redirect(signedUrl, {
      status: 302,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
