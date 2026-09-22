import type { Metadata } from "next";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { BicycleEditForm } from "@/components/bikes/bicycle-edit-form";
import { BicyclePhotoManager } from "@/components/bikes/bicycle-photo-manager";
import { MarkRecoveredButton } from "@/components/bikes/mark-recovered-button";
import { MarkStolenButton } from "@/components/bikes/mark-stolen-button";
import { OwnerBicycleCertificate } from "@/components/bikes/owner-bicycle-certificate";
import { PageShell } from "@/components/layout/page-shell";
import { listBicyclesForOwner } from "@/lib/bicycles";
import { isDatabaseAuthError } from "@/lib/db-errors";
import { findOrCreateUserFromClerk } from "@/lib/users";
import {
  BICYCLE_STATUS_LABELS,
  BICYCLE_TYPE_LABELS,
} from "@/lib/validations/bicycle";
import type { OwnerBicycleListItem } from "@/types/bicycle";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return redirectToSignIn();
  }

  let items: OwnerBicycleListItem[] | null = null;
  let databaseAuthFailed = false;

  try {
    const user = await findOrCreateUserFromClerk(clerkUser);
    items = await listBicyclesForOwner(user.id);
  } catch (error) {
    if (isDatabaseAuthError(error)) {
      databaseAuthFailed = true;
    } else {
      throw error;
    }
  }

  if (databaseAuthFailed || items == null) {
    return (
      <PageShell
        title="Миний гэрчилгээ"
        description="Таны бүртгэлтэй дугуйнууд болон хамгаалалтын баримт."
        eyebrow="Policy dashboard"
      >
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-6"
        >
          <p className="font-heading text-base font-semibold text-destructive">
            Өгөгдлийн сантай холбогдож чадсангүй.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            MongoDB Atlas нэвтрэх мэдээлэл буруу байна. `.env.local` доторх
            `DATABASE_URL`-ийн хэрэглэгч/нууц үгийг Atlas Database Access-тай
            тааруулж шинэчилээд dev server-ээ дахин асаана уу. Өгөгдөл устгах
            эсвэл database reset хийх шаардлагагүй.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Миний гэрчилгээ"
      description="Таны бүртгэлтэй дугуйнууд болон хамгаалалтын баримт."
      eyebrow="Policy dashboard"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Нийт {items.length} дугуй бүртгэлтэй.
        </p>
        <Button render={<Link href="/bikes/register" />}>Дугуй нэмэх</Button>
      </div>

      {items.length === 0 ? (
        <div className="bike-policy-panel rounded-2xl border border-dashed border-primary/25 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Одоогоор бүртгэлтэй дугуй байхгүй байна.
          </p>
          <Button className="mt-4" render={<Link href="/bikes/register" />}>
            Дугуй бүртгүүлэх
          </Button>
        </div>
      ) : (
        <ul className="grid gap-6">
          {items.map((bike) => (
            <li
              key={bike.id}
              className="bike-policy-panel space-y-5 rounded-2xl border border-border/90 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-heading text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                    Covered bicycle
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-semibold">
                    <Link
                      href={`/bikes/${bike.id}`}
                      className="hover:underline"
                    >
                      {bike.brand} {bike.model}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {BICYCLE_TYPE_LABELS[bike.bicycleType]}
                    {" · "}
                    <span
                      className={
                        bike.status === "STOLEN"
                          ? "font-medium text-destructive"
                          : "font-medium text-primary"
                      }
                    >
                      {BICYCLE_STATUS_LABELS[bike.status]}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {bike.registeredAt.toLocaleDateString("mn-MN")}
                </p>
              </div>

              <p className="rounded-lg border border-border/70 bg-background/70 px-3 py-2.5 text-sm">
                <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  Серийн дугаар
                </span>
                <span className="mt-1 block font-medium">{bike.serialNumber}</span>
              </p>

              <BicycleEditForm bicycle={bike} />

              <OwnerBicycleCertificate bicycle={bike} />

              <BicyclePhotoManager
                bicycleId={bike.id}
                sidePhotoUrl={bike.sidePhotoUrl}
                hasSerialPhoto={bike.hasSerialPhoto}
              />

              <div>
                {bike.status === "ACTIVE" ? (
                  <MarkStolenButton bicycleId={bike.id} />
                ) : null}
                {bike.status === "STOLEN" ? (
                  <MarkRecoveredButton bicycleId={bike.id} />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
