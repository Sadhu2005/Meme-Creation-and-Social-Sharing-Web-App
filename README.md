# Meme Creation and Social Sharing Web App

Privacy-first meme platform — create memes, publish to a feed, like and comment. No email required (pet-name accounts).

## Stack

- **Frontend**: Next.js 16 (`apps/web`) + TypeScript + Tailwind CSS
- **Backend / DB / Auth / Storage**: Supabase (Postgres, Auth, Storage)
- **CI**: GitHub Actions (lint + build)

## Project structure

```text
.
├── apps/web/          ← main app (use this)
├── supabase/          ← database migrations
├── docs/              ← architecture + hosting guide
└── .github/workflows/
```

> **Legacy folders removed:** `gitworkflow/` (presentation site). If you still see `frontend/` or `backend/`, stop dev servers on ports **5173** and **5000**, then run `scripts/cleanup-legacy.ps1` or delete those folders manually.

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

Optional — connect Supabase: copy `.env.example` to `apps/web/.env.local` and add your project URL + anon key.

## Features

- Pet-name signup/login with recovery key
- Canvas meme editor (upload, templates, top/bottom text)
- Social feed with likes and comments
- Creator profiles

## Deploy (free)

| What | Where |
|------|--------|
| App (Next.js) | **Vercel** (recommended) |
| Database + auth + images | **Supabase** |

See **[docs/HOSTING.md](docs/HOSTING.md)** for step-by-step setup.

GitHub Pages is **not** suitable for this Next.js app as-is (needs a server). Use Vercel for free hosting.

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run lint     # eslint
```
