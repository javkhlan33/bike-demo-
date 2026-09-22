"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BicyclePhotoField } from "@/components/bikes/bicycle-photo-field";
import {
  BICYCLE_TYPE_LABELS,
  BICYCLE_TYPE_VALUES,
} from "@/lib/validations/bicycle";
import { isCloudinaryConfiguredClient } from "@/lib/cloudinary-client";
import {
  registerBicycleAction,
  type RegisterBicycleState,
} from "@/app/bikes/register/actions";

const initialState: RegisterBicycleState = { ok: false };

const fieldClassName = "w-full";

export function BicycleRegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerBicycleAction,
    initialState,
  );
  const photosRequired = isCloudinaryConfiguredClient();

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6" encType="multipart/form-data">
      {state.message ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </div>
      ) : null}

      {!photosRequired ? (
        <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
          Cloudinary тохируулаагүй тул зураггүйгээр бүртгэх боломжтой. Дараа нь
          dashboard-аас зураг нэмнэ үү.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brand">Брэнд</Label>
          <Input
            id="brand"
            name="brand"
            required
            className={fieldClassName}
            placeholder="Trek, Giant..."
            aria-invalid={Boolean(state.fieldErrors?.brand)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Модель</Label>
          <Input
            id="model"
            name="model"
            required
            className={fieldClassName}
            placeholder="Marlin 7..."
            aria-invalid={Boolean(state.fieldErrors?.model)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bicycleType">Төрөл</Label>
          <select
            id="bicycleType"
            name="bicycleType"
            required
            defaultValue=""
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={Boolean(state.fieldErrors?.bicycleType)}
          >
            <option value="" disabled>
              Сонгох
            </option>
            {BICYCLE_TYPE_VALUES.map((type) => (
              <option key={type} value={type}>
                {BICYCLE_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="serialNumber">Серийн дугаар</Label>
          <Input
            id="serialNumber"
            name="serialNumber"
            required
            className={fieldClassName}
            placeholder="WTU123..."
            aria-invalid={Boolean(state.fieldErrors?.serialNumber)}
          />
          <p className="text-xs text-muted-foreground">
            Дугуйн рам дээрх үйлдвэрлэгчийн серийн дугаарыг оруулна уу.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Үйлдвэрлэсэн он</Label>
          <Input
            id="year"
            name="year"
            type="number"
            min={1950}
            max={new Date().getFullYear() + 1}
            className={fieldClassName}
            placeholder="2024"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Өнгө</Label>
          <Input
            id="color"
            name="color"
            className={fieldClassName}
            placeholder="Хар, улаан..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frameSize">Рамны хэмжээ</Label>
          <Input
            id="frameSize"
            name="frameSize"
            className={fieldClassName}
            placeholder="M, 54cm..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wheelSize">Дугуйн хэмжээ</Label>
          <Input
            id="wheelSize"
            name="wheelSize"
            className={fieldClassName}
            placeholder="29, 700c..."
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="purchaseDate">Худалдаж авсан огноо</Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            className={fieldClassName}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Тайлбар</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Нэмэлт тэмдэглэл..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <BicyclePhotoField
          name="sidePhoto"
          label="Дугуйн үндсэн зураг"
          description="Дугуйгаа бүтнээр нь хажуу талаас нь авсан зураг оруулна уу."
          privacyNote="Энэ зураг таны дугуйн public зураг бөгөөд дараа нь verification болон marketplace дээр ашиглагдаж болно."
          required={photosRequired}
        />
        <BicyclePhotoField
          name="serialPhoto"
          label="Серийн дугаарын зураг"
          description="Дугуйн серийн дугаар тод харагдах зураг оруулна уу."
          privacyNote="Серийн дугаарын зураг зөвхөн танд харагдана. Public profile, QR verification болон marketplace дээр харагдахгүй."
          required={photosRequired}
        />
      </div>

      <Button type="submit" size="lg" className="h-11 px-6" disabled={pending}>
        {pending ? "Бүртгэж байна..." : "Бүртгүүлэх"}
      </Button>
    </form>
  );
}
