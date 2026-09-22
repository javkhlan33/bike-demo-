import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  BICYCLE_STATUS_LABELS,
  BICYCLE_TYPE_LABELS,
} from "@/lib/validations/bicycle";
import { siteConfig } from "@/lib/site-config";
import type { PublicBicycleDetail } from "@/types/bicycle";

export type BicycleCertificateModel = {
  brand: string;
  model: string;
  bicycleType: PublicBicycleDetail["bicycleType"];
  year: number | null;
  frameSize: string | null;
  wheelSize: string | null;
  color: string | null;
  status: PublicBicycleDetail["status"];
  registeredAt: Date | string;
  certificateNumber: string;
  sidePhotoUrl?: string | null;
};

type BicycleCertificateProps = {
  bicycle: BicycleCertificateModel;
  /** Auth-only SVG endpoint — never pass raw qrCodeToken. */
  qrImageSrc?: string;
  /** Extra footer message for public verification context. */
  verificationMessage?: string;
  className?: string;
};

/** Fixed Mongolian month names — avoids Node vs browser ICU locale drift. */
const MN_MONTH_NAMES = [
  "нэгдүгээр",
  "хоёрдугаар",
  "гуравдугаар",
  "дөрөвдүгээр",
  "тавдугаар",
  "зургадугаар",
  "долоодугаар",
  "наймдугаар",
  "есдүгээр",
  "аравдугаар",
  "арван нэгдүгээр",
  "арван хоёрдугаар",
] as const;

/**
 * Deterministic Mongolian date for SSR + hydration.
 * Uses Asia/Ulaanbaatar calendar parts + fixed month labels (not Intl month: "long").
 */
function formatRegisteredAt(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const monthRaw = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const monthIndex = monthRaw ? Number(monthRaw) - 1 : -1;
  const monthName = MN_MONTH_NAMES[monthIndex];

  if (!year || !day || !monthName) {
    return "—";
  }

  return `${year} оны ${monthName} сарын ${day}`;
}

export function BicycleCertificate({
  bicycle,
  qrImageSrc,
  verificationMessage,
  className,
}: BicycleCertificateProps) {
  const isStolen = bicycle.status === "STOLEN";

  const details = [
    { label: "Үйлдвэрлэгч", value: bicycle.brand },
    { label: "Загвар", value: bicycle.model },
    { label: "Төрөл", value: BICYCLE_TYPE_LABELS[bicycle.bicycleType] },
    { label: "Он", value: bicycle.year ? String(bicycle.year) : "—" },
    { label: "Рам", value: bicycle.frameSize ?? "—" },
    { label: "Дугуй", value: bicycle.wheelSize ?? "—" },
    { label: "Өнгө", value: bicycle.color ?? "—" },
  ];

  return (
    <div className={["space-y-4", className ?? ""].join(" ")}>
      <article
        className={[
          "bike-certificate bike-policy-panel overflow-hidden rounded-2xl border",
          isStolen ? "border-destructive/30" : "border-primary/25",
        ].join(" ")}
      >
        <div
          className={
            isStolen
              ? "border-b border-destructive/20 bg-destructive/8 px-5 py-5 sm:px-6"
              : "bike-trust-strip border-b border-primary/20 px-5 py-5 text-primary-foreground sm:px-6"
          }
        >
          <p
            className={
              isStolen
                ? "font-heading text-center text-xs font-semibold tracking-[0.22em] text-destructive uppercase"
                : "font-heading text-center text-xs font-semibold tracking-[0.22em] uppercase opacity-90"
            }
          >
            {siteConfig.name}
          </p>
          <h2
            className={
              isStolen
                ? "mt-2 text-center font-heading text-lg font-bold tracking-tight sm:text-xl"
                : "mt-2 text-center font-heading text-lg font-bold tracking-tight sm:text-xl"
            }
          >
            BICYCLE CERTIFICATE
          </h2>
          <p
            className={
              isStolen
                ? "mt-1 text-center text-sm text-muted-foreground"
                : "mt-1 text-center text-sm text-primary-foreground/80"
            }
          >
            ДУГУЙН ГЭРЧИЛГЭЭ
          </p>

          <div className="mt-4 flex justify-center">
            <span
              className={
                isStolen
                  ? "inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold tracking-wide text-destructive uppercase"
                  : "inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-white/12 px-3 py-1 text-xs font-semibold tracking-wide uppercase"
              }
            >
              {isStolen ? (
                <AlertTriangle className="size-3.5" aria-hidden />
              ) : (
                <CheckCircle2 className="size-3.5" aria-hidden />
              )}
              {isStolen ? "STOLEN" : "VERIFIED · ACTIVE"}
            </span>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          {isStolen ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              Энэ дугуй хулгайд алдсан гэж бүртгэгдсэн байна.
            </div>
          ) : null}

          <dl className="grid gap-3 sm:grid-cols-2">
            {details.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/70 bg-background/70 px-3 py-2.5"
              >
                <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Гэрчилгээний дугаар
              </p>
              <p className="mt-1 font-heading text-base font-bold tracking-wide text-primary">
                {bicycle.certificateNumber}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Бүртгүүлсэн огноо
              </p>
              <p className="mt-1 text-sm font-medium">
                {formatRegisteredAt(bicycle.registeredAt)}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Статус
              </p>
              <p
                className={
                  isStolen
                    ? "mt-1 font-heading text-sm font-semibold tracking-wide text-destructive uppercase"
                    : "mt-1 font-heading text-sm font-semibold tracking-wide text-primary uppercase"
                }
              >
                {BICYCLE_STATUS_LABELS[bicycle.status]}
              </p>
            </div>
          </div>

          {qrImageSrc ? (
            <div className="flex flex-col items-center gap-3 border-t border-border/80 pt-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageSrc}
                alt="Баталгаажуулах QR код"
                width={168}
                height={168}
                className="size-40 rounded-xl border border-border bg-white p-2 shadow-sm"
              />
              <p className="text-center text-sm text-muted-foreground">
                Scan to verify this bicycle
              </p>
            </div>
          ) : null}

          {verificationMessage ? (
            <p className="text-sm text-muted-foreground">{verificationMessage}</p>
          ) : null}

          <div className="flex items-center justify-center gap-2 border-t border-border/60 pt-4 text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden />
            <p className="text-xs tracking-wide uppercase">
              {siteConfig.name} · Trusted Bicycle Registry
            </p>
          </div>
        </div>
      </article>

      {bicycle.sidePhotoUrl ? (
        <figure className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-border/80 bg-background shadow-[0_12px_30px_-24px_oklch(0.28_0.05_168_/_0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bicycle.sidePhotoUrl}
            alt={`${bicycle.brand} ${bicycle.model}`}
            className="aspect-[4/3] max-h-[260px] w-full object-cover"
          />
          <figcaption className="px-3 py-2 text-center text-xs text-muted-foreground">
            Дугуйн үндсэн зураг
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
