create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  template_id uuid references public.templates (id) on delete set null,
  title text not null,
  caption text,
  image_url text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  meme_id uuid not null references public.memes (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.likes (
  meme_id uuid not null references public.memes (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (meme_id, profile_id)
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger templates_set_updated_at
before update on public.templates
for each row
execute function public.set_updated_at();

create trigger memes_set_updated_at
before update on public.memes
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.memes enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

create policy "profiles are viewable by everyone"
on public.profiles
for select
using (true);

create policy "users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "templates are viewable by everyone"
on public.templates
for select
using (true);

create policy "authenticated users can create templates"
on public.templates
for insert
with check (auth.uid() = created_by or created_by is null);

create policy "published memes are viewable by everyone"
on public.memes
for select
using (status = 'published' or auth.uid() = author_id);

create policy "users can create their own memes"
on public.memes
for insert
with check (auth.uid() = author_id);

create policy "users can update their own memes"
on public.memes
for update
using (auth.uid() = author_id);

create policy "comments are viewable by everyone"
on public.comments
for select
using (true);

create policy "users can insert their own comments"
on public.comments
for insert
with check (auth.uid() = author_id);

create policy "likes are viewable by everyone"
on public.likes
for select
using (true);

create policy "users can like as themselves"
on public.likes
for insert
with check (auth.uid() = profile_id);

create policy "users can remove their own likes"
on public.likes
for delete
using (auth.uid() = profile_id);

