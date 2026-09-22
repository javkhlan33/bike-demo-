"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBicycleDetailsAction } from "@/app/bikes/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BICYCLE_TYPE_LABELS,
  BICYCLE_TYPE_VALUES,
} from "@/lib/validations/bicycle";
import type { OwnerBicycleListItem } from "@/types/bicycle";

type BicycleEditFormProps = {
  bicycle: OwnerBicycleListItem;
};

function toDateInputValue(value: Date | null): string {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

export function BicycleEditForm({ bicycle }: BicycleEditFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateBicycleDetailsAction(bicycle.id, formData);
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
    <div className="space-y-3 rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Дугуйн мэдээлэл
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Гэрчилгээ автоматаар шинэчлэгдэнэ. QR / гэрчилгээний дугаар өөрчлөгдөхгүй.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Хаах" : "Засах"}
        </Button>
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

      {!open ? (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Брэнд</dt>
            <dd className="font-medium">{bicycle.brand}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Модель</dt>
            <dd className="font-medium">{bicycle.model}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Төрөл</dt>
            <dd className="font-medium">
              {BICYCLE_TYPE_LABELS[bicycle.bicycleType]}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Өнгө</dt>
            <dd className="font-medium">{bicycle.color ?? "—"}</dd>
          </div>
        </dl>
      ) : (
        <form action={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`brand-${bicycle.id}`}>Брэнд</Label>
            <Input
              id={`brand-${bicycle.id}`}
              name="brand"
              required
              defaultValue={bicycle.brand}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`model-${bicycle.id}`}>Модель</Label>
            <Input
              id={`model-${bicycle.id}`}
              name="model"
              required
              defaultValue={bicycle.model}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`type-${bicycle.id}`}>Төрөл</Label>
            <select
              id={`type-${bicycle.id}`}
              name="bicycleType"
              required
              defaultValue={bicycle.bicycleType}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              {BICYCLE_TYPE_VALUES.map((type) => (
                <option key={type} value={type}>
                  {BICYCLE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`year-${bicycle.id}`}>Он</Label>
            <Input
              id={`year-${bicycle.id}`}
              name="year"
              type="number"
              defaultValue={bicycle.year ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`frame-${bicycle.id}`}>Рам</Label>
            <Input
              id={`frame-${bicycle.id}`}
              name="frameSize"
              defaultValue={bicycle.frameSize ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`wheel-${bicycle.id}`}>Дугуй</Label>
            <Input
              id={`wheel-${bicycle.id}`}
              name="wheelSize"
              defaultValue={bicycle.wheelSize ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`color-${bicycle.id}`}>Өнгө</Label>
            <Input
              id={`color-${bicycle.id}`}
              name="color"
              defaultValue={bicycle.color ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`purchase-${bicycle.id}`}>Худалдан авсан</Label>
            <Input
              id={`purchase-${bicycle.id}`}
              name="purchaseDate"
              type="date"
              defaultValue={toDateInputValue(bicycle.purchaseDate)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`desc-${bicycle.id}`}>Тайлбар</Label>
            <Textarea
              id={`desc-${bicycle.id}`}
              name="description"
              rows={3}
              defaultValue={bicycle.description ?? ""}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
