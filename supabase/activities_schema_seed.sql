-- Schema for activities-driven recommendations
CREATE TABLE IF NOT EXISTS public.activities (
  id text PRIMARY KEY,
  title text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('fácil','medio','avanzado')),
  required_materials text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  environments text[] DEFAULT '{}'
);

-- Seed minimal set aligned with current UI assets
INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments)
VALUES
  ('water-colors', 'Explora colores con agua', 'fácil', ARRAY['paint','bottles'], ARRAY['water_bubbles','art_coloring'], ARRAY['table','garden'])
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  required_materials = EXCLUDED.required_materials,
  interests = EXCLUDED.interests,
  environments = EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments)
VALUES
  ('bottle-sounds', 'Crea sonidos con botellas', 'fácil', ARRAY['bottles','sticks'], ARRAY['sounds_rhythm','discover'], ARRAY['living_room','garden'])
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  required_materials = EXCLUDED.required_materials,
  interests = EXCLUDED.interests,
  environments = EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments)
VALUES
  ('cardboard-construction', 'Construye con cartón', 'medio', ARRAY['cardboard','scissors'], ARRAY['building','art_coloring'], ARRAY['table','floor'])
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  difficulty = EXCLUDED.difficulty,
  required_materials = EXCLUDED.required_materials,
  interests = EXCLUDED.interests,
  environments = EXCLUDED.environments;

