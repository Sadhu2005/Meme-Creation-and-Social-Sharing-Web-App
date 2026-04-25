# Meme Creation and Social Sharing Web App

This repository now includes the initial product scaffold for a meme creation and social sharing platform built with Next.js and Supabase.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage

## Workspace

```text
.
|- apps/
|  `- web/
|- docs/
|- supabase/
`- PROJECT_PLAN.md
```

## Quick Start

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL and anon key
3. Install dependencies with `npm install`
4. Start the app with `npm run dev`

## Current MVP Surface

- landing page
- sign-in page
- feed preview
- meme editor workspace
- profile preview
- health endpoint

## Next Build Steps

- connect live Supabase auth flows
- persist memes and comments in Postgres
- wire uploads to Supabase Storage
- replace mock feed data with database queries

