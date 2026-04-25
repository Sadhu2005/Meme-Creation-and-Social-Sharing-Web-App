insert into public.templates (name, description, image_url, created_by)
values
  (
    'Classic Top And Bottom Text',
    'The standard bold meme format for fast publishing.',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    null
  ),
  (
    'Reaction Panel',
    'Three-panel reaction layout for storytelling memes.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    null
  )
on conflict do nothing;

