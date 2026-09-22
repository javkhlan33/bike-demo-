import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ShopsPreviewSection() {
  return (
    <section className="border-t border-border/80 bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="bike-policy-panel order-2 rounded-2xl border border-dashed border-primary/25 p-8 text-center lg:order-1">
          <p className="font-heading text-sm font-semibold tracking-wide text-primary uppercase">
            Дэлгүүрүүд
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Дугуйн дэлгүүрүүдийн лавлах энд нэмэгдэнэ.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Partner network
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Дугуйн дэлгүүрүүд
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Монголын дугуйн дэлгүүрүүдтэй холбогдож, засвар үйлчилгээ болон
            дэмжлэг авах боломжийг дараагийн шатанд нэмнэ.
          </p>
          <Button className="mt-6" variant="outline" render={<Link href="/shops" />}>
            Дэлгүүрүүд харах
          </Button>
        </div>
      </div>
    </section>
  );
}
