import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { PageShell } from "@/components/layout/page-shell";
import { BicycleRegisterForm } from "@/components/bikes/bicycle-register-form";

export const metadata: Metadata = {
  title: "Дугуй бүртгүүлэх",
};

export default async function BikeRegisterPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  return (
    <PageShell
      title="Дугуй бүртгүүлэх"
      description="Дугуйнхаа үндсэн мэдээлэл болон серийн дугаарыг оруулж өмчлөлийн бүртгэл үүсгэнэ."
    >
      <BicycleRegisterForm />
    </PageShell>
  );
}
