"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { markBicycleStolenAction } from "@/app/dashboard/actions";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type MarkStolenButtonProps = {
  bicycleId: string;
};

export function MarkStolenButton({ bicycleId }: MarkStolenButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await markBicycleStolenAction(bicycleId);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setMessage(result.message);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      {message ? (
        <p role="status" className="text-sm text-primary">
          {message}
        </p>
      ) : null}
      {error && !open ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setError(null);
          }
        }}
      >
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto"
            />
          }
        >
          <AlertTriangle className="size-4" aria-hidden />
          🚨 Хулгайд алдсан гэж бүртгэх
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Дугуйг хулгайд алдсан гэж бүртгэх үү?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Энэ дугуйг хулгайд алдсан гэж бүртгэсний дараа BIKE.MN дээрх QR
              verification болон серийн дугаарын хайлтаар хулгайд алдсан гэж
              харагдана.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogClose
              render={
                <Button type="button" variant="outline" disabled={pending} />
              }
            >
              Цуцлах
            </AlertDialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={pending}
              onClick={onConfirm}
            >
              {pending ? "Бүртгэж байна..." : "Хулгайд алдсан гэж бүртгэх"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
