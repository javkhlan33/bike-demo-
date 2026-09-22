import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  BICYCLE_STATUS_LABELS,
  BICYCLE_TYPE_LABELS,
} from "@/lib/validations/bicycle";
import type { PublicBicycleDetail } from "@/types/bicycle";

/** Serializable public fields for client or server verification UI. */
export type BicycleVerificationViewModel = {
  brand: string;
  model: string;
  bicycleType: PublicBicycleDetail["bicycleType"];
  year: number | null;
  frameSize: string | null;
  wheelSize: string | null;
  color: string | null;
  status: PublicBicycleDetail["status"];
  certificateNumber?: string;
  registeredAt?: Date | string;
  sidePhotoUrl?: string | null;
};

type BicycleVerificationCardProps = {
  bicycle: BicycleVerificationViewModel;
  /** Extra confirmation line under the card (QR verify page). */
  showRegisteredMessage?: boolean;
};

export function BicycleVerificationCard({
  bicycle,
  showRegisteredMessage = false,
}: BicycleVerificationCardProps) {
  const isStolen = bicycle.status === "STOLEN";

  const details = [
    { label: "Төрөл", value: BICYCLE_TYPE_LABELS[bicycle.bicycleType] },
    { label: "Он", value: bicycle.year ? String(bicycle.year) : "—" },
    { label: "Рам", value: bicycle.frameSize ?? "—" },
    { label: "Дугуй", value: bicycle.wheelSize ?? "—" },
    { label: "Өнгө", value: bicycle.color ?? "—" },
  ];

  if (bicycle.certificateNumber) {
    details.push({
      label: "Гэрчилгээ",
      value: bicycle.certificateNumber,
    });
  }

  return (
    <div className="space-y-4">
      {isStolen ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 size-5 shrink-0 text-destructive"
              aria-hidden
            />
            <div>
              <p className="font-heading text-sm font-semibold tracking-wide text-destructive uppercase">
                🚨 Анхааруулга
              </p>
              <p className="mt-1 text-sm text-destructive">
                🚨 Энэ дугуй хулгайд алдсан гэж бүртгэгдсэн байна.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {bicycle.sidePhotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bicycle.sidePhotoUrl}
          alt={`${bicycle.brand} ${bicycle.model}`}
          className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
        />
      ) : null}

      <article
        role="status"
        className={
          isStolen
            ? "bike-policy-panel overflow-hidden rounded-2xl border border-destructive/25"
            : "bike-policy-panel overflow-hidden rounded-2xl border border-primary/20"
        }
      >
        <div
          className={
            isStolen
              ? "flex items-center gap-2 border-b border-destructive/15 bg-destructive/8 px-5 py-3"
              : "flex items-center gap-2 border-b border-primary/15 bg-primary/8 px-5 py-3"
          }
        >
          <CheckCircle2
            className={
              isStolen ? "size-5 text-destructive" : "size-5 text-primary"
            }
            aria-hidden
          />
          <p
            className={
              isStolen
                ? "font-heading text-sm font-semibold tracking-wide text-destructive uppercase"
                : "font-heading text-sm font-semibold tracking-wide text-primary uppercase"
            }
          >
            {isStolen ? "🚨 Хулгайд алдсан" : "✓ Бүртгэлтэй дугуй"}
          </p>
        </div>

        <div className="space-y-5 px-5 py-6">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              {bicycle.brand}
            </h2>
            <p className="mt-1 text-lg text-muted-foreground">{bicycle.model}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Статус
            </p>
            <p
              className={
                isStolen
                  ? "mt-1 font-heading text-base font-semibold tracking-wide text-destructive uppercase"
                  : "mt-1 font-heading text-base font-semibold tracking-wide text-primary uppercase"
              }
            >
              {BICYCLE_STATUS_LABELS[bicycle.status]}
            </p>
          </div>

          {showRegisteredMessage && !isStolen ? (
            <p className="text-sm text-muted-foreground">
              ✓ Энэ дугуй BIKE.MN дээр идэвхтэй бүртгэлтэй байна.
            </p>
          ) : null}
        </div>
      </article>
    </div>
  );
}
