insert into storage.buckets (id, name, public)
values ('memes', 'memes', true)
on conflict (id) do nothing;

create policy "meme images are publicly accessible"
on storage.objects for select
using (bucket_id = 'memes');

create policy "authenticated users can upload memes"
on storage.objects for insert
with check (bucket_id = 'memes' and auth.role() = 'authenticated');

create policy "users can update own meme uploads"
on storage.objects for update
using (bucket_id = 'memes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "users can delete own meme uploads"
on storage.objects for delete
using (bucket_id = 'memes' and auth.uid()::text = (storage.foldername(name))[1]);
