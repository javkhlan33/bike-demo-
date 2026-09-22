import type { Metadata } from "next";
import Link from "next/link";
import { BicycleCertificate } from "@/components/bikes/bicycle-certificate";
import { findPublicBicycleByQrToken } from "@/lib/bicycles";
import { siteConfig } from "@/lib/site-config";
import { qrVerificationTokenSchema } from "@/lib/validations/bicycle";

type VerifyPageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Дугуй баталгаажуулалт",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VerifyBicyclePage({ params }: VerifyPageProps) {
  const { token: rawToken } = await params;
  const parsed = qrVerificationTokenSchema.safeParse(rawToken);

  const bicycle = parsed.success
    ? await findPublicBicycleByQrToken(parsed.data)
    : null;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">
      <div className="text-center">
        <p className="font-heading text-sm font-semibold tracking-[0.2em] text-primary uppercase">
          {siteConfig.name}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Official verification
        </p>
      </div>

      <div className="mt-8">
        {bicycle ? (
          <BicycleCertificate
            bicycle={bicycle}
            verificationMessage={
              bicycle.status === "STOLEN"
                ? undefined
                : "Энэ дугуй BIKE.MN дээр идэвхтэй бүртгэлтэй байна."
            }
          />
        ) : (
          <div
            role="status"
            className="bike-policy-panel rounded-2xl border border-border/90 px-5 py-8 text-center"
          >
            <p className="font-heading text-base font-semibold">
              QR код хүчингүй байна.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Энэ кодоор бүртгэлтэй дугуй олдсонгүй.
            </p>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/bikes/search" className="underline-offset-4 hover:underline">
          Серийн дугаараар шалгах
        </Link>
      </p>
    </div>
  );
}
