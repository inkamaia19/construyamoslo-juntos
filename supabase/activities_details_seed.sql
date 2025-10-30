-- Add detail content to selected activities
UPDATE public.activities SET
  objective = 'Explorar mezclas y transparencias jugando con agua y color.',
  duration_minutes = 15,
  age_min = 3,
  steps = '["Llena 2–3 botellas con agua.", "Agrega una gota de pintura a cada una y agita.", "Observan cómo cambia el color al mezclar.", "Trasvasen para crear nuevos tonos."]',
  tips = '["Usa una bandeja para contener derrames.", "Si no hay pinturas, usa colorantes."]',
  safety = '["Supervisa el manejo de líquidos cerca de enchufes."]'
WHERE id = 'water-colors';

UPDATE public.activities SET
  objective = 'Explorar ritmo y sonido con materiales cotidianos.',
  duration_minutes = 12,
  age_min = 3,
  steps = '["Coloca las botellas vacías en fila.", "Golpea suavemente con palitos.", "Inventen una melodía variando ritmos."]',
  tips = '["Cambiar el nivel de agua cambia el tono."]',
  safety = '["Evita golpes fuertes que rompan plástico o vidrio."]'
WHERE id = 'bottle-sounds';

UPDATE public.activities SET
  objective = 'Desarrollar pensamiento espacial construyendo con formas de cartón.',
  duration_minutes = 25,
  age_min = 4,
  steps = '["Recorta piezas con ayuda.", "Ensambla torres encastrando ranuras.", "Decora con pintura si quieres."]',
  tips = '["Usa cajas de cereales para piezas firmes."]',
  safety = '["Supervisa el uso de tijeras."]'
WHERE id = 'cardboard-construction';
