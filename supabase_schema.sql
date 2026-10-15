-- ==============================================================================
-- SKRIP SQL SUPABASE UNTUK ROBLOX VOTING WEB
-- ==============================================================================
-- Cara pakai:
-- 1. Buka dashboard Supabase (https://supabase.com)
-- 2. Pilih project kamu -> Klik menu "SQL Editor" di bilah menu kiri
-- 3. Klik "New query" -> Paste seluruh isi teks file ini -> Klik "Run" (tombol hijau)
-- ==============================================================================

-- 1. Buat Tabel Submissions (Tempat simpan Username, Gambar, dan Vote)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  roblox_username text not null,
  roblox_avatar_url text,
  caption text,
  image_url text not null,
  votes integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Index agar query cepat saat pengunjung banyak
create index if not exists idx_submissions_votes on public.submissions(votes desc);
create index if not exists idx_submissions_created_at on public.submissions(created_at desc);

-- 3. Aktifkan Row Level Security (RLS)
alter table public.submissions enable row level security;

-- Policy Select (Semua orang bisa melihat karya)
drop policy if exists "Allow public read submissions" on public.submissions;
create policy "Allow public read submissions"
  on public.submissions for select
  using (true);

-- Policy Insert (Semua orang bisa kirim karya)
drop policy if exists "Allow public insert submissions" on public.submissions;
create policy "Allow public insert submissions"
  on public.submissions for insert
  with check (true);

-- 4. Fungsi Atomic Increment Vote (Mencegah bentrok hitungan saat vote bersamaan)
create or replace function public.increment_vote(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.submissions
  set votes = votes + 1
  where id = row_id;
end;
$$;

-- 5. Fungsi Atomic Decrement Vote
create or replace function public.decrement_vote(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.submissions
  set votes = greatest(0, votes - 1)
  where id = row_id;
end;
$$;

-- 6. Buat Storage Bucket untuk Tempat Simpan Gambar
insert into storage.buckets (id, name, public)
values ('roblox_images', 'roblox_images', true)
on conflict (id) do update set public = true;

-- Policy Storage: Siapa saja bisa melihat gambar
drop policy if exists "Public can view roblox_images" on storage.objects;
create policy "Public can view roblox_images"
  on storage.objects for select
  using (bucket_id = 'roblox_images');

-- Policy Storage: Siapa saja bisa upload gambar ke folder roblox_images
drop policy if exists "Public can upload roblox_images" on storage.objects;
create policy "Public can upload roblox_images"
  on storage.objects for insert
  with check (bucket_id = 'roblox_images');
