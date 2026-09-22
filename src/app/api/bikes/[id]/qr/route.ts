import { auth, currentUser } from "@clerk/nextjs/server";
import { getOwnedBicycleQrSvg } from "@/lib/bicycles";
import { findOrCreateUserFromClerk } from "@/lib/users";

type QrRouteProps = {
  params: Promise<{ id: string }>;
};

/**
 * Authenticated owner-only QR image.
 * Returns SVG only — never JSON with qrCodeToken.
 */
export async function GET(_request: Request, { params }: QrRouteProps) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const user = await findOrCreateUserFromClerk(clerkUser);
    const svg = await getOwnedBicycleQrSvg(user.id, id);

    if (!svg) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition": 'inline; filename="bike-mn-qr.svg"',
      },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
