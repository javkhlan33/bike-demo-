"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { ImageEditorDialog } from "@/components/bikes/image-editor-dialog";
import { Label } from "@/components/ui/label";

type BicyclePhotoFieldProps = {
  name: string;
  label: string;
  description: string;
  privacyNote: string;
  required?: boolean;
};

export function BicyclePhotoField({
  name,
  label,
  description,
  privacyNote,
  required = false,
}: BicyclePhotoFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);

  function onPick(fileList: FileList | null) {
    const next = fileList?.[0];
    if (!next) {
      return;
    }
    const url = URL.createObjectURL(next);
    setRawSrc(url);
    setEditorOpen(true);
  }

  function onEdited(edited: File) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(edited);
    setPreviewUrl(url);
    setHasFile(true);

    const input = fileInputRef.current;
    if (input) {
      const transfer = new DataTransfer();
      transfer.items.add(edited);
      input.files = transfer.files;
    }
  }

  return (
    <div className="space-y-2 rounded-2xl border border-border bg-secondary/20 p-4">
      <Label htmlFor={inputId}>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground">{privacyNote}</p>

      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={label}
          className="mt-2 aspect-[4/3] w-full rounded-xl border border-border object-cover"
        />
      ) : (
        <div className="mt-2 flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-border bg-background/70 text-muted-foreground">
          <ImagePlus className="size-8" aria-hidden />
        </div>
      )}

      <input
        ref={fileInputRef}
        id={inputId}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required={required && !hasFile}
        className="mt-2 block w-full text-sm"
        onChange={(event) => onPick(event.target.files)}
      />

      {rawSrc ? (
        <ImageEditorDialog
          open={editorOpen}
          imageSrc={rawSrc}
          title={label}
          onOpenChange={(open) => {
            setEditorOpen(open);
            if (!open && rawSrc) {
              URL.revokeObjectURL(rawSrc);
              setRawSrc(null);
            }
          }}
          onConfirm={onEdited}
        />
      ) : null}
    </div>
  );
}
