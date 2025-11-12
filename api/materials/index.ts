import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_lib/db.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `SELECT id, name, emoji FROM public.materials ORDER BY name`
    );
    return res.status(200).json({ materials: rows });
  } catch (err: any) {
    console.error("Error al obtener materiales:", err.message);
    return res.status(500).json({ error: "No se pudieron obtener los materiales", detail: err.message });
  }
}