import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Зар",
};

export default function MarketplacePage() {
  return (
    <PageShell
      title="Зар"
      description="Зарын зах зээл бэлтгэгдэж байна. Хуурамч зар эсвэл жишээ өгөгдөл оруулаагүй."
    >
      <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-8">
        <p className="text-sm text-muted-foreground">
          Удахгүй: бүртгэлтэй дугуйны зар, шүүлтүүр, дэлгэрэнгүй хуудас.
        </p>
      </div>
    </PageShell>
  );
}
