import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { BicycleSearchForm } from "@/components/bikes/bicycle-search-form";

export const metadata: Metadata = {
  title: "Дугуй шалгах",
};

export default function BikeSearchPage() {
  return (
    <PageShell
      title="Дугуй шалгах"
      description="Серийн дугаараар бүртгэлтэй эсэхийг шалгана уу."
      eyebrow="Policy lookup"
    >
      <BicycleSearchForm />
    </PageShell>
  );
}
