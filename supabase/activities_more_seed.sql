-- Additional activities to broaden coverage
-- Interest: art_coloring
INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('color-mosaics', 'Mosaicos de color con papel', 'fácil', ARRAY['paint'], ARRAY['art_coloring'], ARRAY['table'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('shadow-paint', 'Pinta sombras con linterna', 'medio', ARRAY['flashlight','paint'], ARRAY['art_coloring','discover'], ARRAY['table','living_room'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

-- Interest: water_bubbles
INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('bubble-music', 'Música de burbujas en botellas', 'fácil', ARRAY['bottles','water'], ARRAY['water_bubbles','sounds_rhythm'], ARRAY['table','garden'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('water-paths', 'Caminos de agua y color', 'medio', ARRAY['bottles','paint','sticks'], ARRAY['water_bubbles','art_coloring'], ARRAY['garden','table'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

-- Interest: discover
INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('nature-hunt', 'Exploración de tesoros naturales', 'fácil', ARRAY['plants','sticks'], ARRAY['discover'], ARRAY['garden'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('light-lab', 'Laboratorio de luces y sombras', 'medio', ARRAY['flashlight','fabrics'], ARRAY['discover','art_coloring'], ARRAY['living_room'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

-- Interest: sounds_rhythm
INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('stick-percussion', 'Percusión con palitos y botellas', 'fácil', ARRAY['sticks','bottles'], ARRAY['sounds_rhythm'], ARRAY['living_room','garden'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('texture-orchestra', 'Orquesta de texturas', 'medio', ARRAY['fabrics','cardboard'], ARRAY['sounds_rhythm','discover'], ARRAY['floor','living_room'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

-- Interest: building
INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('tower-challenge', 'Reto de torres con cartón', 'medio', ARRAY['cardboard'], ARRAY['building'], ARRAY['floor','table'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('bridge-builder', 'Puentes y caminos', 'avanzado', ARRAY['cardboard','sticks','scissors'], ARRAY['building','discover'], ARRAY['floor','table'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

-- Cross-interest simple options
INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('fabric-fort', 'Fuerte con telas', 'fácil', ARRAY['fabrics'], ARRAY['building','discover'], ARRAY['living_room'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments) VALUES
('toy-theatre', 'Teatro con juguetes y cartón', 'medio', ARRAY['toys','cardboard','paint'], ARRAY['art_coloring','building'], ARRAY['table','living_room'])
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, difficulty=EXCLUDED.difficulty, required_materials=EXCLUDED.required_materials, interests=EXCLUDED.interests, environments=EXCLUDED.environments;

