import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-[linear-gradient(180deg,oklch(0.96_0.012_165)_0%,oklch(0.935_0.015_168)_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="font-heading text-lg font-bold tracking-tight text-primary">
            {siteConfig.name}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden />
            Trusted Bicycle Registry
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Платформ
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/bikes" className="transition-colors hover:text-foreground">
                  Дугуй
                </Link>
              </li>
              <li>
                <Link
                  href="/bikes/search"
                  className="transition-colors hover:text-foreground"
                >
                  Дугуй шалгах
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="transition-colors hover:text-foreground"
                >
                  Зар
                </Link>
              </li>
              <li>
                <Link href="/shops" className="transition-colors hover:text-foreground">
                  Дэлгүүр
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Хамгаалалт
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link
                  href="/bikes/register"
                  className="transition-colors hover:text-foreground"
                >
                  Бүртгүүлэх
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-foreground"
                >
                  Миний гэрчилгээ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Бүх эрх хуулиар
            хамгаалагдсан.
          </p>
          <p className="text-xs text-muted-foreground">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
