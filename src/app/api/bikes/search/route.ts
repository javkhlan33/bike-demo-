import { NextResponse } from "next/server";
import { findPublicBicycleBySerial } from "@/lib/bicycles";
import { searchSerialSchema } from "@/lib/validations/bicycle";
import {
  toPublicBicycleSearchPayload,
  type BicycleSearchApiResponse,
} from "@/types/bicycle";

/**
 * GET /api/bikes/search?serial=...
 * Public serial lookup — returns only privacy-safe fields.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchSerialSchema.safeParse({
      serial: searchParams.get("serial") ?? "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          found: false,
          bicycle: null,
          message: "Оруулсан мэдээллээ шалгана уу.",
        } satisfies BicycleSearchApiResponse,
        { status: 400 },
      );
    }

    const bicycle = await findPublicBicycleBySerial(parsed.data.serial);

    if (!bicycle) {
      return NextResponse.json({
        ok: true,
        found: false,
        bicycle: null,
      } satisfies BicycleSearchApiResponse);
    }

    return NextResponse.json({
      ok: true,
      found: true,
      bicycle: toPublicBicycleSearchPayload(bicycle),
    } satisfies BicycleSearchApiResponse);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        found: false,
        bicycle: null,
        message: "Алдаа гарлаа. Дахин оролдоно уу.",
      } satisfies BicycleSearchApiResponse,
      { status: 500 },
    );
  }
}
