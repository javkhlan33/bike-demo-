"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Lock } from "lucide-react";
import {
  removeBicycleSerialPhotoAction,
  removeBicycleSidePhotoAction,
  replaceBicycleSerialPhotoAction,
  replaceBicycleSidePhotoAction,
} from "@/app/bikes/actions";
import { ImageEditorDialog } from "@/components/bikes/image-editor-dialog";
import { Button } from "@/components/ui/button";
import { isCloudinaryConfiguredClient } from "@/lib/cloudinary-client";

type BicyclePhotoManagerProps = {
  bicycleId: string;
  sidePhotoUrl: string | null;
  hasSerialPhoto: boolean;
};

const thumbFrameClassName =
  "relative mx-auto aspect-[4/3] w-full max-h-[240px] overflow-hidden rounded-xl border border-border bg-secondary/30";

export function BicyclePhotoManager({
  bicycleId,
  sidePhotoUrl,
  hasSerialPhoto,
}: BicyclePhotoManagerProps) {
  const router = useRouter();
  const cloudinaryReady = isCloudinaryConfiguredClient();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSrc, setEditorSrc] = useState<string | null>(null);
  const [editorKind, setEditorKind] = useState<"side" | "serial">("side");
  const sideInputRef = useRef<HTMLInputElement>(null);
  const serialInputRef = useRef<HTMLInputElement>(null);

  function beginEdit(kind: "side" | "serial", file: File) {
    setEditorKind(kind);
    setEditorSrc(URL.createObjectURL(file));
    setEditorOpen(true);
  }

  function onEdited(file: File) {
    setMessage(null);
    setError(null);
    const formData = new FormData();
    formData.set("photo", file);

    startTransition(async () => {
      const result =
        editorKind === "side"
          ? await replaceBicycleSidePhotoAction(bicycleId, formData)
          : await replaceBicycleSerialPhotoAction(bicycleId, formData);

      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      router.refresh();
    });
  }

  function onRemove(kind: "side" | "serial") {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result =
        kind === "side"
          ? await removeBicycleSidePhotoAction(bicycleId)
          : await removeBicycleSerialPhotoAction(bicycleId);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Зургууд
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Гэрчилгээний доорх дэмжих зураг. Хоёр зураг ижил хэмжээтэй.
        </p>
      </div>

      {message ? (
        <p role="status" className="text-sm text-primary">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!cloudinaryReady ? (
        <p className="text-sm text-muted-foreground">
          Cloudinary тохируулаагүй тул зураг оруулах боломжгүй.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {/* Side photo — public */}
        <div className="rounded-xl border border-border bg-background/80 p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">Дугуйн зураг</p>
              <p className="text-xs text-muted-foreground">Public зураг</p>
            </div>
          </div>

          <div className={thumbFrameClassName}>
            {sidePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sidePhotoUrl}
                alt="Дугуйн хажуугийн зураг"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1.5 px-3 text-center text-muted-foreground">
                <ImagePlus className="size-5" aria-hidden />
                <p className="text-xs leading-snug">
                  Дугуйн зураг оруулаагүй байна
                </p>
              </div>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <input
              ref={sideInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  beginEdit("side", file);
                }
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!cloudinaryReady || pending}
              onClick={() => sideInputRef.current?.click()}
            >
              Зураг солих
            </Button>
            {sidePhotoUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() => onRemove("side")}
              >
                Устгах
              </Button>
            ) : null}
          </div>
        </div>

        {/* Serial photo — private */}
        <div className="rounded-xl border border-border bg-background/80 p-3">
          <div className="mb-2">
            <p className="text-sm font-medium">Серийн дугаарын зураг</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="size-3 shrink-0" aria-hidden />
              🔒 Зөвхөн танд харагдана
            </p>
          </div>

          <div className={thumbFrameClassName}>
            {hasSerialPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/bikes/${encodeURIComponent(bicycleId)}/serial-photo`}
                alt="Серийн дугаарын зураг"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1.5 px-3 text-center text-muted-foreground">
                <ImagePlus className="size-5" aria-hidden />
                <p className="text-xs leading-snug">
                  Серийн дугаарын зураг оруулаагүй байна
                </p>
              </div>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <input
              ref={serialInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  beginEdit("serial", file);
                }
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!cloudinaryReady || pending}
              onClick={() => serialInputRef.current?.click()}
            >
              Зураг солих
            </Button>
            {hasSerialPhoto ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() => onRemove("serial")}
              >
                Устгах
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {editorSrc ? (
        <ImageEditorDialog
          open={editorOpen}
          imageSrc={editorSrc}
          title={editorKind === "side" ? "Хажуугийн зураг" : "Серийн зураг"}
          onOpenChange={(open) => {
            setEditorOpen(open);
            if (!open) {
              URL.revokeObjectURL(editorSrc);
              setEditorSrc(null);
            }
          }}
          onConfirm={onEdited}
        />
      ) : null}
    </section>
  );
}
