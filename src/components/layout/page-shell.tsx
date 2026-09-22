import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";

type PageShellProps = {
  title: string;
  description: string;
  children?: ReactNode;
  eyebrow?: string;
};

export function PageShell({
  title,
  description,
  children,
  eyebrow = siteConfig.tagline,
}: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl border-l-2 border-primary/40 pl-4 sm:pl-5">
        <p className="font-heading text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children ? <div className="mt-8 sm:mt-10">{children}</div> : null}
    </div>
  );
}
