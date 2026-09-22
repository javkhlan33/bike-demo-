import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Дэлгүүр",
};

export default function ShopsPage() {
  return (
    <PageShell
      title="Дэлгүүрүүд"
      description="Дугуйн дэлгүүрүүдийн лавлах дараагийн шатанд нэмэгдэнэ."
    >
      <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-8">
        <p className="text-sm text-muted-foreground">
          Удахгүй: дэлгүүрийн профайл, байршил, үйлчилгээний мэдээлэл.
        </p>
      </div>
    </PageShell>
  );
}
