# BIKE.MN

Mongolian bicycle registration and ecosystem platform.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Clerk authentication
- MongoDB + Prisma
- Cloudinary (images, later)

## Getting started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in Clerk, MongoDB, and (optionally) Cloudinary values.

3. Generate the Prisma client and run the app:

```bash
npm run db:generate
npm run dev
```

4. After MongoDB is available, push the schema:

```bash
npm run db:push
```

## Notes

- Public UI language is Mongolian.
- Code, comments, and architecture are English.
- Owner phone, email, and address must never be exposed publicly.
- Marketplace, payments, and QR flows are intentionally not implemented yet.
# bike-demo-
