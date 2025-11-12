import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_lib/db.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
        `SELECT id, label, emoji FROM public.environments`
    );
    return res.status(200).json({ spaces: rows });
  } catch (err: any) {
    console.error("Error al obtener espacios:", err.message);
    return res.status(500).json({ error: "No se pudieron obtener los espacios" });
  }
}