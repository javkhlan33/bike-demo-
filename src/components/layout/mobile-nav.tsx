"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const clerkUiEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim(),
);

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Цэс нээх"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,20rem)] gap-0 p-0">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-heading text-lg tracking-tight">
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3">
          {siteConfig.nav.map((item) => (
            <SheetClose
              key={item.href}
              nativeButton={false}
              render={
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
          <SheetClose
            nativeButton={false}
            render={
              <Link
                href="/about"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              />
            }
          >
            Бидний тухай
          </SheetClose>
        </nav>
        {clerkUiEnabled ? (
          <div className="mt-auto border-t border-border p-4">
            <Show when="signed-out">
              <div className="flex flex-col gap-2">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Нэвтрэх
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Бүртгүүлэх</Button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="flex flex-col gap-2">
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full",
                      )}
                    />
                  }
                >
                  Dashboard
                </SheetClose>
                <SignOutButton>
                  <Button variant="ghost" className="w-full">
                    Гарах
                  </Button>
                </SignOutButton>
              </div>
            </Show>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
