import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AuthControls } from "@/components/layout/auth-controls";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="bike-trust-strip hidden h-8 items-center justify-center gap-2 px-4 text-[11px] font-medium tracking-wide text-primary-foreground sm:flex">
        <ShieldCheck className="size-3.5 opacity-90" aria-hidden />
        <span>{siteConfig.tagline}</span>
        <span className="mx-2 opacity-40">·</span>
        <span className="opacity-90">Trusted Bicycle Registry</span>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex flex-col leading-none transition-opacity hover:opacity-85"
          >
            <span className="font-heading text-xl font-bold tracking-tight text-primary">
              {siteConfig.name}
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Official Registry
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="outline"
              size="sm"
              className="hidden xl:inline-flex"
              render={<Link href="/bikes/search" />}
            >
              Дугуй шалгах
            </Button>
            <AuthControls />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
