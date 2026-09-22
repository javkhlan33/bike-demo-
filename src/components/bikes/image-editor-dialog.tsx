"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { RotateCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ImageEditorDialogProps = {
  open: boolean;
  imageSrc: string;
  title: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void;
};

async function createCroppedFile(
  imageSrc: string,
  crop: Area,
  rotation: number,
  fileName: string,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("CANVAS_UNAVAILABLE");
  }

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const rotatedWidth = image.width * cos + image.height * sin;
  const rotatedHeight = image.width * sin + image.height * cos;

  const rotateCanvas = document.createElement("canvas");
  rotateCanvas.width = rotatedWidth;
  rotateCanvas.height = rotatedHeight;
  const rotateCtx = rotateCanvas.getContext("2d");
  if (!rotateCtx) {
    throw new Error("CANVAS_UNAVAILABLE");
  }

  rotateCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
  rotateCtx.rotate(radians);
  rotateCtx.drawImage(image, -image.width / 2, -image.height / 2);

  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.drawImage(
    rotateCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("BLOB_FAILED"));
          return;
        }
        resolve(result);
      },
      "image/jpeg",
      0.92,
    );
  });

  return new File([blob], fileName.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("IMAGE_LOAD_FAILED")));
    image.src = src;
  });
}

export function ImageEditorDialog({
  open,
  imageSrc,
  title,
  onOpenChange,
  onConfirm,
}: ImageEditorDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [pending, setPending] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedArea) {
      return;
    }
    setPending(true);
    try {
      const file = await createCroppedFile(
        imageSrc,
        croppedArea,
        rotation,
        "bicycle-photo.jpg",
      );
      onConfirm(file);
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Зургийг тайрч, эргүүлнэ үү. Дараа нь баталгаажуулна.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="relative h-64 overflow-hidden rounded-xl bg-black/90">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs text-muted-foreground">
            Томруулах
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRotation((value) => (value + 90) % 360)}
          >
            <RotateCw className="size-4" aria-hidden />
            90° эргүүлэх
          </Button>
        </div>

        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Цуцлах
          </Button>
          <Button type="button" disabled={pending || !croppedArea} onClick={handleConfirm}>
            {pending ? "Бэлдэж байна..." : "Зураг баталгаажуулах"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
