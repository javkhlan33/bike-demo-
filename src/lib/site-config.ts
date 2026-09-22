export const siteConfig = {
  name: "BIKE.MN",
  description:
    "Монголын дугуйчдад зориулсан албан ёсны бүртгэл, хамгаалалт болон баталгаажуулалтын платформ.",
  tagline: "Бүртгэл · Хамгаалалт · Баталгаажуулалт",
  nav: [
    { href: "/bikes", label: "Дугуй" },
    { href: "/marketplace", label: "Зар" },
    { href: "/shops", label: "Дэлгүүр" },
    { href: "/bikes/register", label: "Дугуй бүртгүүлэх" },
  ],
} as const;

/**
 * Public app origin for absolute URLs (QR verification links).
 * Prefer NEXT_PUBLIC_APP_URL; fall back to localhost in development.
 */
export function getAppBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

/**
 * Safe public verification URL encoded into QR codes.
 * Token is a path credential — never render it in page UI.
 */
export function getBicycleVerificationUrl(token: string): string {
  return `${getAppBaseUrl()}/verify/${encodeURIComponent(token)}`;
}
