-- ============================================================================
-- Thalist.ai — Full database schema
-- Recruitment search & candidate management platform
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. PROFILES
-- ============================================================================

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  company     text,
  role        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'User profile data, one row per auth.users entry.';

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at on profile changes
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- ============================================================================
-- 2. SEARCHES
-- ============================================================================

create table public.searches (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  query          text not null,
  filters        jsonb,
  results_count  integer,
  created_at     timestamptz not null default now()
);

comment on table public.searches is 'Log of every candidate search a user performs.';

create index idx_searches_user_id on public.searches (user_id);
create index idx_searches_created_at on public.searches (created_at desc);

alter table public.searches enable row level security;

create policy "Users can view their own searches"
  on public.searches for select
  using (auth.uid() = user_id);

create policy "Users can insert their own searches"
  on public.searches for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own searches"
  on public.searches for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 3. CANDIDATES
-- ============================================================================

create table public.candidates (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  exa_id           text not null,
  name             text not null,
  title            text,
  company          text,
  location         text,
  linkedin_url     text,
  email            text,
  phone            text,
  skills           text[] not null default '{}',
  experience_years integer,
  summary          text,
  source           text,
  raw_data         jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.candidates is 'Candidates saved by users from Exa search results.';

create index idx_candidates_user_id on public.candidates (user_id);
create index idx_candidates_exa_id on public.candidates (exa_id);
create index idx_candidates_skills on public.candidates using gin (skills);

alter table public.candidates enable row level security;

create policy "Users can view their own candidates"
  on public.candidates for select
  using (auth.uid() = user_id);

create policy "Users can insert their own candidates"
  on public.candidates for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own candidates"
  on public.candidates for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own candidates"
  on public.candidates for delete
  using (auth.uid() = user_id);

create trigger candidates_updated_at
  before update on public.candidates
  for each row execute function public.update_updated_at();

-- ============================================================================
-- 4. PIPELINE STAGES
-- ============================================================================

create table public.pipeline_stages (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  name        text not null,
  position    integer not null,
  color       text,
  created_at  timestamptz not null default now()
);

comment on table public.pipeline_stages is 'User-defined recruitment pipeline stages (e.g. Sourced, Screening, Interview).';

create index idx_pipeline_stages_user_id on public.pipeline_stages (user_id);

alter table public.pipeline_stages enable row level security;

create policy "Users can view their own pipeline stages"
  on public.pipeline_stages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own pipeline stages"
  on public.pipeline_stages for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pipeline stages"
  on public.pipeline_stages for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own pipeline stages"
  on public.pipeline_stages for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 5. PIPELINE CANDIDATES
-- ============================================================================

create table public.pipeline_candidates (
  id            uuid primary key default uuid_generate_v4(),
  candidate_id  uuid not null references public.candidates (id) on delete cascade,
  stage_id      uuid not null references public.pipeline_stages (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  notes         text,
  moved_at      timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

comment on table public.pipeline_candidates is 'Junction table placing candidates into pipeline stages.';

create index idx_pipeline_candidates_user_id on public.pipeline_candidates (user_id);
create index idx_pipeline_candidates_stage_id on public.pipeline_candidates (stage_id);
create index idx_pipeline_candidates_candidate_id on public.pipeline_candidates (candidate_id);

alter table public.pipeline_candidates enable row level security;

create policy "Users can view their own pipeline candidates"
  on public.pipeline_candidates for select
  using (auth.uid() = user_id);

create policy "Users can insert their own pipeline candidates"
  on public.pipeline_candidates for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pipeline candidates"
  on public.pipeline_candidates for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own pipeline candidates"
  on public.pipeline_candidates for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 6. SAVED SEARCHES
-- ============================================================================

create table public.saved_searches (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  name        text not null,
  query       text not null,
  filters     jsonb,
  created_at  timestamptz not null default now()
);

comment on table public.saved_searches is 'Named search queries users save for later reuse.';

create index idx_saved_searches_user_id on public.saved_searches (user_id);

alter table public.saved_searches enable row level security;

create policy "Users can view their own saved searches"
  on public.saved_searches for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved searches"
  on public.saved_searches for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own saved searches"
  on public.saved_searches for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved searches"
  on public.saved_searches for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 7. EXPORTS
-- ============================================================================

create table public.exports (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  type        text not null,
  filters     jsonb,
  file_url    text,
  row_count   integer,
  created_at  timestamptz not null default now()
);

comment on table public.exports is 'Records of CSV/PDF exports generated by users.';

create index idx_exports_user_id on public.exports (user_id);

alter table public.exports enable row level security;

create policy "Users can view their own exports"
  on public.exports for select
  using (auth.uid() = user_id);

create policy "Users can insert their own exports"
  on public.exports for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own exports"
  on public.exports for delete
  using (auth.uid() = user_id);
