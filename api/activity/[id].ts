import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  
  const pool = getPool();
  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    const { rows } = await pool.query(
      `SELECT id, title, difficulty, required_materials, optional_materials, objective,
              duration_minutes, age_min, age_max, steps, tips, safety, image_url
         FROM public.activities WHERE id = $1`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(rows[0]);
  } catch (err: any) {
    console.error("Activity details error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch activity", detail: err?.message });
  }
}