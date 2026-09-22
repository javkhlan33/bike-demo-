"use client";

import Link from "next/link";
import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const clerkUiEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim(),
);

export function AuthControls() {
  if (!clerkUiEnabled) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm" className="text-sm font-medium">
            Нэвтрэх
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm" className="text-sm font-medium">
            Бүртгүүлэх
          </Button>
        </SignUpButton>
      </Show>

      <Show when="signed-in">
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-medium"
          render={<Link href="/dashboard" />}
        >
          Dashboard
        </Button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8",
            },
          }}
        />
        <SignOutButton>
          <Button variant="outline" size="sm" className="text-sm">
            Гарах
          </Button>
        </SignOutButton>
      </Show>
    </div>
  );
}
