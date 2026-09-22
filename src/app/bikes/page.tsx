import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Дугуй",
};

export default function BikesPage() {
  return (
    <PageShell
      title="Дугуй"
      description="Дугуй бүртгэх, хайх болон өмчлөлийн мэдээлэлтэй ажиллах хэсэг."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button render={<Link href="/bikes/register" />}>Дугуй бүртгүүлэх</Button>
        <Button variant="outline" render={<Link href="/bikes/search" />}>
          Дугуй шалгах
        </Button>
      </div>
    </PageShell>
  );
}
