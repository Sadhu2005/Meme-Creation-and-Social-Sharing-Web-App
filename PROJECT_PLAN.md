# Meme Creation and Social Sharing Web App

## Current State

- GitHub remote connected: `origin -> https://github.com/Sadhu2005/Meme-Creation-and-Social-Sharing-Web-App.git`
- Repository is currently empty, so this plan assumes a greenfield build

## Recommended Stack

### Core Stack

- Frontend: Next.js 15 + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Meme editor: `react-konva` for canvas-based meme editing
- Backend: Supabase
- Database: Supabase Postgres
- Auth: Supabase Auth
- File storage: Supabase Storage
- Validation: Zod
- Forms: React Hook Form
- State management: Zustand for local editor state
- Testing: Vitest + React Testing Library + Playwright
- Deployment: Vercel (frontend) + Supabase (backend services)

### Why this stack

- Fast to build for a solo developer
- Free-tier friendly for MVP work
- No need to maintain a separate always-on backend server at the start
- Easy to scale later by adding edge functions or a dedicated API service

## High-Level Architecture

- `Next.js` handles UI, routing, SEO, server actions, and API endpoints
- `Supabase` handles auth, database, storage, and row-level security
- Meme image composition happens mostly on the client to reduce backend cost
- Final meme images are uploaded to storage and metadata is stored in Postgres

## Suggested Directory Structure

```text
Meme-Creation-and-Social-Sharing-Web-App/
|- apps/
|  |- web/
|  |  |- public/
|  |  |- src/
|  |  |  |- app/
|  |  |  |  |- (marketing)/
|  |  |  |  |- (auth)/
|  |  |  |  |- (dashboard)/
|  |  |  |  |- api/
|  |  |  |  `- globals.css
|  |  |  |- components/
|  |  |  |  |- ui/
|  |  |  |  |- layout/
|  |  |  |  `- shared/
|  |  |  |- features/
|  |  |  |  |- auth/
|  |  |  |  |- profile/
|  |  |  |  |- templates/
|  |  |  |  |- meme-editor/
|  |  |  |  |- memes/
|  |  |  |  |- feed/
|  |  |  |  |- likes/
|  |  |  |  |- comments/
|  |  |  |  `- notifications/
|  |  |  |- lib/
|  |  |  |  |- supabase/
|  |  |  |  |- validations/
|  |  |  |  |- constants/
|  |  |  |  `- utils/
|  |  |  |- server/
|  |  |  |  |- actions/
|  |  |  |  |- services/
|  |  |  |  `- repositories/
|  |  |  |- hooks/
|  |  |  |- types/
|  |  |  `- tests/
|  |  |- package.json
|  |  |- next.config.ts
|  |  `- tsconfig.json
|- packages/
|  |- ui/
|  |- config/
|  `- types/
|- supabase/
|  |- migrations/
|  |- seed.sql
|  |- config.toml
|  `- functions/
|- docs/
|  |- architecture.md
|  |- api-contracts.md
|  `- db-schema.md
|- .github/
|  `- workflows/
|- .env.example
|- package.json
|- turbo.json
`- README.md
```

## Frontend Structure

### Main pages

- Landing page
- Login / signup
- User profile
- Meme editor
- Meme feed
- Meme details page
- Notifications
- Saved memes

### Feature modules

- `features/meme-editor`
  - template picker
  - text layers
  - drag/resize
  - font controls
  - download/export
- `features/feed`
  - trending feed
  - latest feed
  - following feed
- `features/profile`
  - bio
  - avatar
  - user posts
  - saved posts

## Backend Structure

### Backend responsibilities

- auth and session management
- meme metadata CRUD
- feed queries
- like and comment actions
- profile management
- notifications
- image storage
- authorization using row-level security

### Suggested backend split

- `apps/web/src/server/actions`
  - small authenticated mutations
- `apps/web/src/server/services`
  - business logic
- `apps/web/src/server/repositories`
  - database access wrappers
- `supabase/functions`
  - async or privileged tasks
  - moderation helpers
  - image post-processing if needed later

## Database Design

### Core tables

- `profiles`
- `templates`
- `memes`
- `meme_layers`
- `likes`
- `comments`
- `follows`
- `tags`
- `meme_tags`
- `saved_memes`
- `notifications`
- `reports`

### Important relations

- one user -> many memes
- one meme -> many comments
- one meme -> many likes
- many memes -> many tags
- one user -> many followers and following

## MVP Scope

### Phase 1

- project setup
- auth
- profile setup
- responsive layout
- template upload

### Phase 2

- meme editor
- text overlays
- image upload
- meme publish flow
- public feed

### Phase 3

- likes
- comments
- saved memes
- user profile pages

### Phase 4

- follow system
- notifications
- trending logic
- moderation and report flow

### Phase 5

- testing
- polish
- analytics
- SEO and performance

## Free Deployment Plan

### Recommended MVP deployment

- Frontend hosting: Vercel Hobby
- Backend platform: Supabase Free
- Database: Supabase Postgres
- Storage: Supabase Storage

### Optional upgrade path

- Media-heavy workloads: Cloudinary
- Extra database headroom: Neon or paid Supabase
- Dedicated backend later: `apps/api` using NestJS or Express deployed to Render or Railway

## Development Order

1. Initialize monorepo and Next.js app
2. Configure Tailwind, shadcn, ESLint, Prettier, Husky
3. Set up Supabase project, auth, storage, and first migrations
4. Build auth pages and protected routes
5. Build meme editor MVP
6. Build create/publish/list meme flow
7. Add profile, likes, comments, and saved memes
8. Add notifications and follow system
9. Write tests and deploy

## Best Starting Point

If we want to move fast, the first implementation milestone should be:

- Next.js app scaffold
- Supabase integration
- auth flow
- database schema
- meme editor basic canvas

That gives us a usable MVP foundation without overbuilding.
