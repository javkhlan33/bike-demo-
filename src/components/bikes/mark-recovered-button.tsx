"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { markBicycleRecoveredAction } from "@/app/dashboard/actions";
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

type MarkRecoveredButtonProps = {
  bicycleId: string;
};

export function MarkRecoveredButton({ bicycleId }: MarkRecoveredButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await markBicycleRecoveredAction(bicycleId);

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
            <Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto" />
          }
        >
          <CheckCircle2 className="size-4" aria-hidden />
          ✓ Дугуй олдсон / буцаан авсан
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Дугуйгаа буцаан олсон уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Дугуй олдож, буцаан авсан бол төлөвийг идэвхтэй болгож болно.
              Үүний дараа QR verification болон серийн дугаарын хайлтаар дугуй
              хулгайд алдсан гэж харагдахаа болино.
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
            <Button type="button" disabled={pending} onClick={onConfirm}>
              {pending ? "Бүртгэж байна..." : "Олдсон гэж бүртгэх"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
