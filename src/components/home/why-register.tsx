import { EyeOff, History, SearchCheck } from "lucide-react";

const reasons = [
  {
    icon: History,
    title: "Өмчлөлийн түүх",
    description:
      "Эзэмшлийн түүх хадгалагдаж, дараагийн шилжүүлэгт итгэлтэй суурь болно.",
  },
  {
    icon: SearchCheck,
    title: "Хурдан шалгалт",
    description:
      "Серийн дугаар эсвэл QR-аар дугуйг хайж, бүртгэлтэй эсэх болон статусыг шалгана.",
  },
  {
    icon: EyeOff,
    title: "Нууцлалтай хамгаалалт",
    description:
      "Эзэмшигчийн утас, имэйл, хаяг нийтэд ил харагдахгүй. Зөвхөн шаардлагатай мэдээлэл гарна.",
  },
] as const;

export function WhyRegisterSection() {
  return (
    <section className="border-t border-border/80 bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Why register
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Яагаад дугуйгаа бүртгүүлэх вэ?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Бүртгэл нь таны дугуйд даатгалын түвшний баримт, хамгаалалт, итгэл
            үүсгэнэ.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reasons.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/80 bg-background/90 p-6 shadow-[0_12px_30px_-24px_oklch(0.28_0.05_168_/_0.45)]"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
