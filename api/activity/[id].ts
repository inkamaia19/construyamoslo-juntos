import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_lib/db.js";

// Helper para construir la consulta de actualización de forma segura
function buildUpdateQuery(body: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let fieldIndex = 1;

    // Lista de campos permitidos para editar
    const allowedFields = [
        'title', 'difficulty', 'objective', 'duration_minutes', 'age_min', 
        'steps', 'required_materials', 'image_url'
    ];

    for (const key of allowedFields) {
        if (body[key] !== undefined) {
            fields.push(`${key} = $${fieldIndex++}`);
            values.push(body[key]);
        }
    }
    return { fields, values, fieldIndex };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  const { id } = req.query as { id: string };

  if (!id) return res.status(400).json({ error: "Missing id" });

  // --- OBTENER DATOS (GET) ---
  if (req.method === "GET") {
    try {
      const { rows } = await pool.query(
        `SELECT id, title, difficulty, required_materials, optional_materials, objective,
                duration_minutes, age_min, age_max, steps, tips, safety, image_url
           FROM public.activities WHERE id = $1`,
        [id]
      );
      if (!rows[0]) return res.status(404).json({ error: "No encontrado" });
      return res.json(rows[0]);
    } catch (err: any) {
      return res.status(500).json({ error: "No se pudo obtener la actividad", detail: err?.message });
    }
  }

  // --- ACTUALIZAR DATOS (PATCH) ---
  if (req.method === "PATCH") {
    // En una app real, aquí verificarías si el usuario tiene permisos de administrador.
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { fields, values, fieldIndex } = buildUpdateQuery(body);

        if (fields.length === 0) {
            return res.status(200).json({ message: "Nada que actualizar" });
        }
        
        const query = `UPDATE public.activities SET ${fields.join(', ')} WHERE id = $${fieldIndex} RETURNING *`;
        values.push(id);

        const { rows } = await pool.query(query, values);
        if (!rows[0]) return res.status(404).json({ error: "No encontrado para actualizar" });
        
        return res.json(rows[0]);
    } catch (err: any) {
      console.error("Error al actualizar la actividad:", err.message);
      return res.status(500).json({ error: "No se pudo actualizar la actividad", detail: err?.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}