import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { getPublicBicycleById } from "@/lib/bicycles";
import {
  BICYCLE_STATUS_LABELS,
  BICYCLE_TYPE_LABELS,
} from "@/lib/validations/bicycle";

type BikeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: BikeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const bicycle = await getPublicBicycleById(id);

  if (!bicycle) {
    return { title: "Дугуй олдсонгүй" };
  }

  return {
    title: `${bicycle.brand} ${bicycle.model}`,
  };
}

export default async function BikeDetailPage({ params }: BikeDetailPageProps) {
  const { id } = await params;
  const detail = await getPublicBicycleById(id);

  if (!detail) {
    notFound();
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: "Брэнд", value: detail.brand },
    { label: "Модель", value: detail.model },
    { label: "Төрөл", value: BICYCLE_TYPE_LABELS[detail.bicycleType] },
    {
      label: "Үйлдвэрлэсэн он",
      value: detail.year ? String(detail.year) : "—",
    },
    { label: "Рамны хэмжээ", value: detail.frameSize ?? "—" },
    { label: "Дугуйн хэмжээ", value: detail.wheelSize ?? "—" },
    { label: "Өнгө", value: detail.color ?? "—" },
    { label: "Гэрчилгээний дугаар", value: detail.certificateNumber },
    { label: "Статус", value: BICYCLE_STATUS_LABELS[detail.status] },
    {
      label: "Бүртгүүлсэн огноо",
      value: detail.registeredAt.toLocaleDateString("mn-MN"),
    },
  ];

  return (
    <PageShell
      title={`${detail.brand} ${detail.model}`}
      description="Нийтийн мэдээлэл. Эзэмшигчийн хувийн мэдээлэл харагдахгүй."
    >
      {detail.sidePhotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={detail.sidePhotoUrl}
          alt={`${detail.brand} ${detail.model}`}
          className="mx-auto mb-8 aspect-[4/3] w-full max-w-2xl rounded-2xl border border-border object-cover"
        />
      ) : null}
      <dl className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-border bg-secondary/20 px-4 py-3"
          >
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
