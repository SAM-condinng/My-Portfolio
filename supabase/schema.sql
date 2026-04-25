-- ============================================================
-- Samuel Maina Gachuru Portfolio — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── PROFILE ──────────────────────────────────────────────────
create table if not exists profile (
  id            uuid primary key default gen_random_uuid(),
  bio           text,
  tagline       text,
  education     text,
  avatar_url    text,
  resume_url    text,
  available     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Insert default row so getProfile() always returns something
insert into profile (bio, tagline, education, available)
values (
  'I''m Samuel Maina Gachuru, a passionate Computer Science student at Zetech University, Kenya. Born in 2003 in Nyandarua, I discovered my love for technology in high school and have been building ever since.',
  'Full Stack Developer · Student · Entrepreneur',
  'Zetech University — BSc Computer Science (2023–present)',
  true
) on conflict do nothing;

-- ── PROJECTS ─────────────────────────────────────────────────
create table if not exists projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  tech_stack    text[] default '{}',
  github_url    text,
  live_url      text,
  thumbnail_url text,
  category      text,
  featured      boolean default false,
  view_count    integer default 0,
  created_at    timestamptz default now()
);

-- ── SKILLS ───────────────────────────────────────────────────
create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text default 'Web Dev',
  proficiency integer default 75 check (proficiency between 0 and 100),
  created_at  timestamptz default now()
);

-- Seed skills
insert into skills (name, category, proficiency) values
  ('React / JavaScript', 'Web Dev', 85),
  ('HTML / CSS',         'Web Dev', 90),
  ('Python',             'Web Dev', 75),
  ('Tailwind CSS',       'Web Dev', 88),
  ('Node.js',            'Backend', 65),
  ('Supabase / PostgreSQL', 'Backend', 70),
  ('Git / GitHub',       'Tools',   80),
  ('Photography',        'Design',  72)
on conflict do nothing;

-- ── BLOG POSTS ───────────────────────────────────────────────
create table if not exists blog_posts (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text unique not null,
  excerpt        text,
  content        text,
  cover_image    text,
  tags           text[] default '{}',
  published      boolean default false,
  likes          integer default 0,
  read_time_min  integer default 3,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── TESTIMONIALS ─────────────────────────────────────────────
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  company     text,
  quote       text not null,
  avatar_url  text,
  rating      integer default 5 check (rating between 1 and 5),
  created_at  timestamptz default now()
);

-- ── CONTACT MESSAGES ─────────────────────────────────────────
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ── TIMELINE ─────────────────────────────────────────────────
create table if not exists timeline (
  id            uuid primary key default gen_random_uuid(),
  year          text not null,
  event         text not null,
  display_order integer default 0,
  created_at    timestamptz default now()
);

-- Seed timeline entries
insert into timeline (year, event, display_order) values
  ('2003', 'Born in Nyandarua, Kenya, raised in a loving, faith-driven home.', 0),
  ('2018', 'Joined high school and discovered a passion for computers and technology.', 1),
  ('2022', 'Completed high school with distinction; built first website as a personal project.', 2),
  ('2023', 'Enrolled at Zetech University to study Computer Science.', 3),
  ('2024', 'Built Zemacu Church Website — first full-stack production project.', 4),
  ('2025', 'Continuing to build, learn, and grow as a developer and entrepreneur.', 5)
on conflict do nothing;

-- ── SOCIAL LINKS ─────────────────────────────────────────────
create table if not exists social_links (
  id             uuid primary key default gen_random_uuid(),
  platform       text not null,
  url            text not null,
  display_order  integer default 0,
  created_at     timestamptz default now()
);

-- Seed social links
insert into social_links (platform, url, display_order) values
  ('LinkedIn', 'https://www.linkedin.com/in/samuel-maina-n/', 0),
  ('GitHub',   'https://github.com',                          1),
  ('Twitter',  'https://x.com',                               2)
on conflict do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profile           enable row level security;
alter table projects          enable row level security;
alter table skills            enable row level security;
alter table blog_posts        enable row level security;
alter table testimonials      enable row level security;
alter table contact_messages  enable row level security;
alter table social_links      enable row level security;
alter table timeline          enable row level security;

-- Public can read everything except contact_messages
create policy "Public read profile"       on profile           for select using (true);
create policy "Public read projects"      on projects          for select using (true);
create policy "Public read skills"        on skills            for select using (true);
create policy "Public read blog"          on blog_posts        for select using (published = true);
create policy "Public read testimonials"  on testimonials      for select using (true);
create policy "Public read social links"  on social_links      for select using (true);
create policy "Public read timeline"      on timeline          for select using (true);

-- Anyone can insert a contact message (contact form)
create policy "Anyone can send message"   on contact_messages  for insert with check (true);

-- Authenticated (admin) can do everything
create policy "Admin all profile"         on profile           for all using (auth.role() = 'authenticated');
create policy "Admin all projects"        on projects          for all using (auth.role() = 'authenticated');
create policy "Admin all skills"          on skills            for all using (auth.role() = 'authenticated');
create policy "Admin all blog"            on blog_posts        for all using (auth.role() = 'authenticated');
create policy "Admin all testimonials"    on testimonials      for all using (auth.role() = 'authenticated');
create policy "Admin all messages"        on contact_messages  for all using (auth.role() = 'authenticated');
create policy "Admin all social links"    on social_links      for all using (auth.role() = 'authenticated');
create policy "Admin all timeline"        on timeline          for all using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for avatars
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

create policy "Public read avatars"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Admin upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Admin update avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for documents (CV / Resume)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict do nothing;

create policy "Public read documents"
  on storage.objects for select using (bucket_id = 'documents');

create policy "Admin upload documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');

create policy "Admin update documents"
  on storage.objects for update
  using (bucket_id = 'documents' and auth.role() = 'authenticated');

create policy "Admin delete documents"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.role() = 'authenticated');
