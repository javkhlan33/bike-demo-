import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Бидний тухай",
};

export default function AboutPage() {
  return (
    <PageShell
      title="Бидний тухай"
      description="BIKE.MN нь Монголын дугуйчдад зориулсан нэгдсэн бүртгэл, хамгаалалт болон худалдааны платформ юм."
    >
      <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Бид дугуйны өмчлөл, сериал дугаарын хайлт, алдагдсан дугуйны мэдээлэл,
          засвар үйлчилгээний түүх зэрэг үндсэн хэрэгцээг нэг дороос шийдэх
          зорилготой.
        </p>
        <p>
          Энэ хувилбар нь зөвхөн суурь бүтэц. Бизнес логик, төлбөр, QR болон
          маркетплейс дараагийн шатуудад нэмэгдэнэ.
        </p>
      </div>
    </PageShell>
  );
}
