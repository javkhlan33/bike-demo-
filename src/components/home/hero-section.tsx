import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="bike-hero-grid absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,oklch(0.55_0.08_168_/_0.14),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-6.5rem)] w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-16">
        <div className="max-w-xl">
          <p className="animate-fade-up mb-4 font-heading text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            BIKE.MN
          </p>
          <h1 className="animate-fade-up-delay font-heading text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.35rem]">
            Дугуйгаа бүртгүүл.
            <span className="mt-2 block text-primary">Хамгаалж уна.</span>
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Албан ёсны бүртгэл, QR баталгаажуулалт болон өмчлөлийн хамгаалалт —
            даатгалын түвшний итгэлтэйгээр.
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 px-6 text-base"
              render={<Link href="/bikes/register" />}
            >
              Дугуй бүртгүүлэх
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 text-base"
              render={<Link href="/bikes/search" />}
            >
              Дугуй шалгах
            </Button>
          </div>
        </div>

        <div className="animate-fade-up-delay relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div className="bike-policy-panel relative overflow-hidden rounded-2xl border border-primary/20 p-6 sm:p-7">
            <div
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full border border-primary/10"
              aria-hidden
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                  Protection Policy
                </p>
                <p className="mt-2 font-heading text-xl font-bold tracking-tight">
                  Дугуйн гэрчилгээ
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/8 px-2 py-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
                <ShieldCheck className="size-3" aria-hidden />
                Verified
              </span>
            </div>

            <dl className="mt-6 space-y-3 border-t border-border/80 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Бүртгэл</dt>
                <dd className="font-medium">Идэвхтэй</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">QR шалгалт</dt>
                <dd className="font-medium">Нийтэд нээлттэй</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Өмчлөл</dt>
                <dd className="font-medium">Нууцлалтай</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Хулгайд алдсан</dt>
                <dd className="font-medium">Түргэн мэдээлэх</dd>
              </div>
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              BIKE.MN нь таны дугуйд албан ёсны бүртгэлийн баримт олгож, худалдан
              авагч болон эзэмшигчийн итгэлийг нэмэгдүүлнэ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
