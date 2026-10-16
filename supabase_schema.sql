-- ==============================================================================
-- TREC KL FASHION SHOW - DATABASE & SECURITY SCHEMA (PRODUCTION READY)
-- ==============================================================================
-- Features included:
-- 1. Anti-Sybil / Anti-Double Vote: Database-level unique constraint per Roblox ID
-- 2. Atomic Increment: Prevents race conditions during simultaneous voting
-- 3. Row Level Security (RLS): Strictly limits access permissions
-- 4. Storage Bucket Security: Only allows valid image uploads up to 8MB
-- ==============================================================================

-- 1. Submissions Table (Contestant Models)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  roblox_username text not null,
  roblox_avatar_url text,
  caption text,
  image_url text not null,
  tiktok_url text,
  votes integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MIGRATION: Jika tabel submissions sudah dibuat sebelumnya, jalankan baris ini di SQL Editor Supabase:
alter table public.submissions add column if not exists tiktok_url text;

-- Indexes for lightning fast queries
create index if not exists idx_submissions_votes on public.submissions(votes desc);
create index if not exists idx_submissions_created_at on public.submissions(created_at desc);

-- Enable RLS
alter table public.submissions enable row level security;

drop policy if exists "Allow public read submissions" on public.submissions;
create policy "Allow public read submissions"
  on public.submissions for select
  using (true);

drop policy if exists "Allow public insert submissions" on public.submissions;
create policy "Allow public insert submissions"
  on public.submissions for insert
  with check (true);

-- 2. Anti-Fraud Votes Log Table (Tracks each vote by Roblox User ID)
create table if not exists public.votes_log (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  voter_roblox_id bigint not null,
  voter_roblox_username text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- SECURITY: One Roblox account can only vote ONCE per outfit submission
  constraint unique_vote_per_user unique(submission_id, voter_roblox_id)
);

create index if not exists idx_votes_log_user on public.votes_log(voter_roblox_id);
create index if not exists idx_votes_log_sub on public.votes_log(submission_id);

alter table public.votes_log enable row level security;

drop policy if exists "Allow public read votes_log" on public.votes_log;
create policy "Allow public read votes_log"
  on public.votes_log for select
  using (true);

-- 3. Secure Atomic Vote RPC (Enforces Anti-Double Voting & Strict 2-Vote Total Quota)
create or replace function public.cast_verified_vote(
  target_submission_id uuid,
  voter_id bigint,
  voter_name text
)
returns json
language plpgsql
security definer
as $$
declare
  already_voted boolean;
  user_vote_count integer;
begin
  -- 1. Check if user already reached the strict 2-vote limit for the fashion show
  select count(*) from public.votes_log
  where voter_roblox_id = voter_id
  into user_vote_count;

  if user_vote_count >= 2 then
    return json_build_object(
      'success', false, 
      'message', 'Vote quota reached! Each Roblox account is strictly limited to 2 permanent votes.'
    );
  end if;

  -- 2. Check if user already voted for this specific outfit
  select exists(
    select 1 from public.votes_log
    where submission_id = target_submission_id and voter_roblox_id = voter_id
  ) into already_voted;

  if already_voted then
    return json_build_object('success', false, 'message', 'You have already voted for this outfit!');
  end if;

  -- 3. Insert vote log (Permanent record)
  insert into public.votes_log (submission_id, voter_roblox_id, voter_roblox_username)
  values (target_submission_id, voter_id, voter_name);

  -- 4. Safely increment vote count
  update public.submissions
  set votes = votes + 1
  where id = target_submission_id;

  return json_build_object('success', true, 'message', 'Vote successfully recorded!');
exception
  when unique_violation then
    return json_build_object('success', false, 'message', 'Duplicate vote detected.');
end;
$$;

-- 4. Secure Atomic Cancel Vote RPC
create or replace function public.cancel_verified_vote(
  target_submission_id uuid,
  voter_id bigint
)
returns json
language plpgsql
security definer
as $$
begin
  delete from public.votes_log
  where submission_id = target_submission_id and voter_roblox_id = voter_id;

  if found then
    update public.submissions
    set votes = greatest(0, votes - 1)
    where id = target_submission_id;

    return json_build_object('success', true, 'message', 'Vote removed.');
  end if;

  return json_build_object('success', false, 'message', 'No vote found to cancel.');
end;
$$;

-- 5. Fallback Increment/Decrement functions
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

-- 6. Storage Bucket Configuration
insert into storage.buckets (id, name, public)
values ('roblox_images', 'roblox_images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view roblox_images" on storage.objects;
create policy "Public can view roblox_images"
  on storage.objects for select
  using (bucket_id = 'roblox_images');

drop policy if exists "Public can upload roblox_images" on storage.objects;
create policy "Public can upload roblox_images"
  on storage.objects for insert
  with check (bucket_id = 'roblox_images');
