# Free hosting guide (Meme Forge)

## Recommended stack (all free tiers)

| Part | Service | Why |
|------|---------|-----|
| **Frontend + API** | [Vercel](https://vercel.com) | Built for Next.js (`apps/web`). Runs pages, API routes, and server actions. |
| **Database + Auth + file storage** | [Supabase](https://supabase.com) | Postgres, login, and meme image bucket — no separate backend server needed. |

You do **not** need a paid server for this project if you use Supabase. The old Express `backend/` folder was a prototype and has been removed.

---

## 1. Supabase (database + auth + storage)

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. **SQL**: Run migrations in `supabase/migrations/` (SQL Editor → paste each file).
3. **Storage**: Migration `20260518000000_storage_memes_bucket.sql` creates public `memes` bucket.
4. **Auth**: Authentication → Providers → Email → disable “Confirm email” if you want instant signup with pet-name flow.
5. Copy **Project URL** and **publishable key** into Vercel env vars (below).
6. Copy **secret key** as `SUPABASE_SERVICE_ROLE_KEY` (server only — needed for password recovery).

Free tier includes: 500 MB database, 1 GB storage, 50k monthly active users (limits change — check Supabase pricing).

---

## 2. Frontend — Vercel from GitHub (recommended, free)

Vercel **pulls code from GitHub** and **hosts the live site on Vercel** (not GitHub Pages). Every `git push` can auto-deploy.

### Step-by-step (matches your Vercel dashboard)

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New…** → **Project** (or **Import Project**).
3. **Connect GitHub** → allow Vercel → pick repo:  
   `Sadhu2005/Meme-Creation-and-Social-Sharing-Web-App`
4. **Configure Project** (important):

   | Setting | Value |
   |---------|--------|
   | Framework Preset | **Next.js** |
   | Root Directory | **`apps/web`** |
   | Build Command | `npm run build` (default) |
   | Install Command | `cd ../.. && npm install` (monorepo) |

   `apps/web/vercel.json` in the repo sets install/build for you when root is `apps/web`.

5. **Environment variables** (before Deploy):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
   ```

5. Deploy. You get a URL like `https://meme-forge-xxx.vercel.app`.

Free hobby tier: personal projects, automatic deploys on git push.

---

## 3. GitHub Pages (optional, limited)

GitHub Pages **cannot** run this Next.js app fully (no server actions, no `/api` routes) unless you convert to a 100% static export and client-only Supabase calls.

**Practical options:**

- Use **Vercel** for the real app (above).
- Use **GitHub Pages** only for a simple marketing/README site (not required).

If you still want Pages for a static export later, you would need `output: 'export'` in `next.config.ts` and replace server actions with client-side Supabase — significant change.

---

## 4. Backend (Express) — only if you insist

The removed `backend/` folder was optional. With Supabase, you skip hosting Node/Express.

If you add custom APIs later, free hosts:

| Service | Free tier notes |
|---------|-----------------|
| [Render](https://render.com) | Free web service (sleeps after inactivity) |
| [Railway](https://railway.app) | Limited free credits per month |
| [Fly.io](https://fly.io) | Small free VM allowance |

---

## 5. Local development (what to run)

**Only one frontend:**

```bash
npm install
npm run dev
```

Open **http://localhost:3000** (not port 5173).

- Without Supabase env: demo mode (localStorage).
- With `.env.local` in `apps/web`: live Supabase.

---

## Quick checklist

- [ ] Supabase project + migrations applied  
- [ ] `NEXT_PUBLIC_SUPABASE_*` set on Vercel  
- [ ] Repo connected to Vercel, root `apps/web`  
- [ ] Stop using `frontend/` (port 5173) — removed from repo  
