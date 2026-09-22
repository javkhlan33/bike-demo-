import { BadgeCheck, LockKeyhole, Scale } from "lucide-react";

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Албан ёсны баталгаажуулалт",
    description:
      "Серийн дугаар, гэрчилгээний дугаар болон QR дээр суурилсан шалгалтын суурь.",
  },
  {
    icon: Scale,
    title: "Ил тод статус",
    description:
      "Дугуй идэвхтэй эсвэл хулгайд алдсан эсэхийг олон нийтэд тодорхой харуулна.",
  },
  {
    icon: LockKeyhole,
    title: "Нууцлал бааз",
    description:
      "Хувийн мэдээллийг хамгаалж, зөвхөн шаардлагатай нийтийн мэдээллийг гаргана.",
  },
] as const;

export function TrustSection() {
  return (
    <section className="border-t border-border/80 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="bike-trust-strip overflow-hidden rounded-2xl px-6 py-8 text-primary-foreground sm:px-8 sm:py-10">
          <div className="max-w-2xl">
            <p className="font-heading text-xs font-semibold tracking-[0.18em] uppercase opacity-80">
              Trust & assurance
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Итгэл ба баталгаажуулалт
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
              BIKE.MN-ийн зорилго нь Монголын дугуйчдад найдвартай, албан ёсны
              бүртгэлийн орчин бүрдүүлэхэд оршино.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {trustPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm"
              >
                <item.icon className="size-5 text-trust" aria-hidden />
                <h3 className="mt-3 font-heading text-base font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
