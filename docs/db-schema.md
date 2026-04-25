# Database Schema

## Core tables

- `profiles`
- `templates`
- `memes`
- `comments`
- `likes`

## Relationship summary

- each `profile` can create many `memes`
- each `meme` can have many `comments`
- each `meme` can have many `likes`
- each `template` can be reused across many `memes`

## Auth pattern

- `profiles.id` maps to `auth.users.id`
- profile rows are created automatically with an auth trigger
- row-level security protects writes

