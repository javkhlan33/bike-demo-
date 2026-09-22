"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BicycleVerificationCard } from "@/components/bikes/bicycle-verification-card";
import type {
  BicycleSearchApiResponse,
  PublicBicycleSearchPayload,
} from "@/types/bicycle";

type SearchUiState =
  | { status: "idle" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "not_found" }
  | { status: "found"; bicycle: PublicBicycleSearchPayload };

export function BicycleSearchForm() {
  const [serial, setSerial] = useState("");
  const [state, setState] = useState<SearchUiState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = serial.trim();
    if (!value) {
      setState({ status: "empty" });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/bikes/search?serial=${encodeURIComponent(value)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          },
        );

        const data = (await response.json()) as BicycleSearchApiResponse;

        if (!response.ok || !data.ok) {
          setState({
            status: "error",
            message:
              "message" in data && data.message
                ? data.message
                : "Алдаа гарлаа. Дахин оролдоно уу.",
          });
          return;
        }

        if (!data.found || !data.bicycle) {
          setState({ status: "not_found" });
          return;
        }

        setState({ status: "found", bicycle: data.bicycle });
      } catch {
        setState({
          status: "error",
          message: "Алдаа гарлаа. Дахин оролдоно уу.",
        });
      }
    });
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serial">Серийн дугаар</Label>
          <Input
            id="serial"
            name="serial"
            value={serial}
            onChange={(event) => setSerial(event.target.value)}
            placeholder="Жишээ: TREK-MGL-0001"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="h-11 w-full text-base"
            aria-invalid={state.status === "empty"}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full sm:w-auto"
          disabled={pending}
        >
          {pending ? "Шалгаж байна..." : "Шалгах"}
        </Button>
      </form>

      {state.status === "empty" ? (
        <p role="alert" className="text-sm text-destructive">
          Оруулсан мэдээллээ шалгана уу.
        </p>
      ) : null}

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      {state.status === "not_found" ? (
        <div
          role="status"
          className="rounded-2xl border border-border bg-secondary/30 px-5 py-6"
        >
          <p className="text-sm text-muted-foreground">
            Энэ серийн дугаараар бүртгэлтэй дугуй олдсонгүй.
          </p>
        </div>
      ) : null}

      {state.status === "found" ? (
        <BicycleVerificationCard bicycle={state.bicycle} />
      ) : null}
    </div>
  );
}
