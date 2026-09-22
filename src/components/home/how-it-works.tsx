import { FileBadge2, QrCode, Shield } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: FileBadge2,
    title: "Дугуйгаа бүртгүүлэх",
    description:
      "Серийн дугаар, зураг болон үндсэн мэдээллээ оруулж албан ёсны бүртгэл үүсгэнэ.",
  },
  {
    step: "02",
    icon: Shield,
    title: "Хамгаалалт идэвхжүүлнэ",
    description:
      "Өмчлөлийн түүх хадгалагдаж, хулгайд алдсан тохиолдолд олон нийтэд анхааруулга гарна.",
  },
  {
    step: "03",
    icon: QrCode,
    title: "QR-аар шалгана",
    description:
      "Гэрчилгээний QR кодоор хэн ч дугуйг баталгаажуулж, статусыг шалгаж болно.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="border-t border-border/80 bg-background/60 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Coverage flow
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Хэрхэн ажилладаг вэ?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Даатгалын бүтээгдэхүүн шиг энгийн гурван алхам — бүртгэл, хамгаалалт,
            баталгаажуулалт.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="bike-policy-panel relative rounded-2xl border border-border/90 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <p className="font-heading text-xs font-semibold tracking-[0.2em] text-primary/70">
                  {item.step}
                </p>
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
