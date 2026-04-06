-- ============================================================
-- AI Autoblogging - Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database.
-- ============================================================

-- Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content       TEXT NOT NULL,
  meta_description TEXT,
  published     BOOLEAN NOT NULL DEFAULT false,
  tweeted       BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on slug for fast lookups from the blog pages
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts (slug);

-- Index for filtering by published status
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts (published);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.posts;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS on the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow public READ access to published posts (for the public blog)
CREATE POLICY "Allow public read of published posts"
  ON public.posts
  FOR SELECT
  USING (published = true);

-- Allow the service role (backend/cron) full access (INSERT, UPDATE, DELETE)
-- This policy is implicitly granted to the service_role; anon key can only SELECT.

-- Allow anon to read ALL posts (needed for admin dashboard count queries)
-- WARNING: Remove this if you want published-only public access.
-- For the admin panel, use the service_role key in the backend instead.
CREATE POLICY "Allow anon read all posts"
  ON public.posts
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access"
  ON public.posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
