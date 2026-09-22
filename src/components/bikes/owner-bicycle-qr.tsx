"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

type OwnerBicycleQrProps = {
  bicycleId: string;
  label: string;
};

/**
 * Owner QR controls. Image is fetched from an auth-only SVG endpoint
 * so the raw qrCodeToken never appears in client props or JSON.
 */
export function OwnerBicycleQr({ bicycleId, label }: OwnerBicycleQrProps) {
  const qrSrc = `/api/bikes/${encodeURIComponent(bicycleId)}/qr`;

  function handleDownload() {
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = "bike-mn-qr.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handlePrint() {
    const absoluteQrSrc = `${window.location.origin}${qrSrc}`;
    const popup = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=420,height=560",
    );
    if (!popup) {
      window.print();
      return;
    }

    popup.document.write(`<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="utf-8" />
  <title>${siteConfig.name} QR</title>
  <style>
    body { font-family: system-ui, sans-serif; text-align: center; padding: 32px; color: #0f172a; }
    h1 { font-size: 18px; letter-spacing: 0.12em; margin: 0 0 8px; }
    p { margin: 0 0 20px; font-size: 14px; color: #475569; }
    img { width: 240px; height: 240px; }
  </style>
</head>
<body>
  <h1>${siteConfig.name}</h1>
  <p>Дугуйн бүртгэл шалгах</p>
  <img src="${absoluteQrSrc}" alt="QR код" width="240" height="240" />
</body>
</html>`);
    popup.document.close();
    popup.focus();
    setTimeout(() => {
      popup.print();
    }, 250);
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        QR код
      </p>

      <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt={`${label} QR код`}
          width={160}
          height={160}
          className="size-40 rounded-lg border border-border bg-white p-2"
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Утасны камераар уншуулж бүртгэл шалгана.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
              <Download className="size-4" aria-hidden />
              QR татах
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="size-4" aria-hidden />
              QR хэвлэх
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
