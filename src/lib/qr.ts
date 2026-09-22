import QRCode from "qrcode";

/**
 * Generate a scannable QR as SVG markup from a public verification URL.
 * Do not embed owner PII or raw token as visible text beside the code.
 */
export async function generateVerificationQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 256,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
}
