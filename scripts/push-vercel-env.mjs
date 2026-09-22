#!/usr/bin/env node
/**
 * Push required env var NAMES from .env.local to Vercel (production + preview).
 * Never prints secret values. Requires: vercel login && vercel link
 *
 * Usage: npm run vercel:env:push
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = path.join(ROOT, ".env.local");

const REQUIRED = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "DATABASE_URL",
];

const RECOMMENDED = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

function parseEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const map = new Map();
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) map.set(key, value);
  }
  return map;
}

function upsert(name, value, target) {
  try {
    execFileSync("npx", ["vercel", "env", "rm", name, target, "--yes"], {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });
  } catch {
    // Variable may not exist yet.
  }

  execFileSync(
    "npx",
    ["vercel", "env", "add", name, target, "--value", value, "--yes"],
    { cwd: ROOT, stdio: ["pipe", "inherit", "inherit"], env: process.env },
  );
  console.log(`OK  ${name} → ${target} (value not printed)`);
}

if (!fs.existsSync(ENV_PATH)) {
  console.error("Missing .env.local — aborting.");
  process.exit(1);
}

const env = parseEnvFile(ENV_PATH);
const names = [...REQUIRED, ...RECOMMENDED];

console.log("Pushing env names to Vercel (values hidden)...");
for (const name of names) {
  const value = env.get(name)?.trim();
  if (!value) {
    console.log(`SKIP ${name} (empty/missing in .env.local)`);
    continue;
  }
  for (const target of ["production", "preview"]) {
    upsert(name, value, target);
  }
}

console.log("\nDone. Redeploy on Vercel for NEXT_PUBLIC_* to take effect.");
console.log(
  "Then open /api/health and confirm clerkConfigured + databaseConfigured.",
);
