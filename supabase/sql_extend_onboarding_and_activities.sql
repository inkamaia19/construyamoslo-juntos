-- Extend onboarding_sessions with child info
ALTER TABLE public.onboarding_sessions
  ADD COLUMN IF NOT EXISTS child_age integer,
  ADD COLUMN IF NOT EXISTS child_name text,
  ADD COLUMN IF NOT EXISTS time_available text, -- short | medium | long
  ADD COLUMN IF NOT EXISTS parent_email text,
  ADD COLUMN IF NOT EXISTS parent_context text;

-- Extend activities with richer content
ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS optional_materials text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS objective text,
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS age_min integer,
  ADD COLUMN IF NOT EXISTS age_max integer,
  ADD COLUMN IF NOT EXISTS steps jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tips jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS safety jsonb DEFAULT '[]'::jsonb;
