"use client";

import { useRef } from "react";
import { Download, Printer } from "lucide-react";
import { BicycleCertificate } from "@/components/bikes/bicycle-certificate";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import type { OwnerBicycleListItem } from "@/types/bicycle";

type OwnerBicycleCertificateProps = {
  bicycle: OwnerBicycleListItem;
};

export function OwnerBicycleCertificate({
  bicycle,
}: OwnerBicycleCertificateProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const qrSrc = `/api/bikes/${encodeURIComponent(bicycle.id)}/qr`;

  function handleDownloadQr() {
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = "bike-mn-qr.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handlePrintCertificate() {
    const node = printRef.current;
    if (!node) {
      return;
    }

    const popup = window.open("", "_blank", "noopener,noreferrer,width=720,height=900");
    if (!popup) {
      window.print();
      return;
    }

    const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
      .map((el) => el.outerHTML)
      .join("\n");

    popup.document.write(`<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="utf-8" />
  <title>${siteConfig.name} — Дугуйн гэрчилгээ</title>
  ${styles}
  <style>
    @page { margin: 16mm; }
    body { background: white; margin: 0; padding: 24px; }
    .print-actions { display: none !important; }
  </style>
</head>
<body>
  ${node.outerHTML}
</body>
</html>`);
    popup.document.close();
    popup.focus();
    setTimeout(() => {
      popup.print();
    }, 400);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Дугуйн гэрчилгээ
        </p>
        <div className="print-actions flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleDownloadQr}>
            <Download className="size-4" aria-hidden />
            QR татах
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrintCertificate}
          >
            <Printer className="size-4" aria-hidden />
            Гэрчилгээ хэвлэх
          </Button>
        </div>
      </div>

      <div ref={printRef}>
        <BicycleCertificate
          bicycle={{
            brand: bicycle.brand,
            model: bicycle.model,
            bicycleType: bicycle.bicycleType,
            year: bicycle.year,
            frameSize: bicycle.frameSize,
            wheelSize: bicycle.wheelSize,
            color: bicycle.color,
            status: bicycle.status,
            registeredAt: bicycle.registeredAt,
            certificateNumber: bicycle.certificateNumber,
          }}
          qrImageSrc={qrSrc}
          verificationMessage="Миний дугуй BIKE.MN дээр албан ёсоор бүртгэлтэй."
        />
      </div>
    </div>
  );
}
