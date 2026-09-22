import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketplacePreviewSection() {
  return (
    <section className="border-t border-border/80 bg-background/60 py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Marketplace
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Зарын зах зээл
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Удахгүй бүртгэлтэй дугуйгаа зарж, найдвартай арилжаа хийх боломжтой
            болно. Одоогоор энэ хэсэг бэлтгэгдэж байна.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            render={<Link href="/marketplace" />}
          >
            Зар руу очих
          </Button>
        </div>

        <div className="bike-policy-panel rounded-2xl border border-dashed border-primary/25 p-8 text-center">
          <p className="font-heading text-sm font-semibold tracking-wide text-primary uppercase">
            Удахгүй
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Зарын жагсаалт болон шүүлтүүр энд гарна. Хуурамч өгөгдөл оруулаагүй.
          </p>
        </div>
      </div>
    </section>
  );
}
