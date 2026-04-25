# Architecture

## Runtime split

- `apps/web`: frontend, route handlers, server actions, and feature UI
- `supabase`: database migrations, storage setup, and backend platform config

## Request flow

1. User opens the Next.js app on Vercel
2. Public pages render on the server
3. Authenticated mutations call server actions or route handlers
4. Server logic talks to Supabase for auth, database, and storage
5. Meme assets are stored in Supabase Storage and referenced from Postgres

## Key product areas

- authentication
- meme editor
- feed
- profile
- engagement

