import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_lib/db.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
        `SELECT id, label, emoji, color FROM public.interests`
    );
    return res.status(200).json({ interests: rows });
  } catch (err: any) {
    console.error("Error al obtener intereses:", err.message);
    return res.status(500).json({ error: "No se pudieron obtener los intereses" });
  }
}