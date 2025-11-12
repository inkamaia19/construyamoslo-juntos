import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const pool = getPool();
  const { id } = req.query as { id: string };
  const secret = (req.headers["x-session-secret"] as string) || (req.query.secret as string);

  if (!id) return res.status(400).json({ error: "Missing id" });
  if (!secret) return res.status(401).json({ error: "Missing session secret" });

  try {
    const { rows: srows } = await pool.query(
      "SELECT environment, interest FROM public.onboarding_sessions WHERE id = $1 AND session_secret = $2",
      [id, secret]
    );
    if (!srows[0]) return res.status(404).json({ error: "Session not found" });

    const { environment, interest } = srows[0] as { environment: string | null; interest: string | null };

    if (!interest || !environment) {
      return res.status(400).json({ error: "Interest and environment must be selected." });
    }

    // --- CONSULTA FINAL CON image_url ---
    const { rows: recommendations } = await pool.query(
      `
      (
        SELECT
            oa.id,
            oa.title,
            oa.image_url,
            oa.base_activity_id,
            a.difficulty,
            a.required_materials
        FROM public.onboarding_activities AS oa
        JOIN public.activities AS a ON oa.base_activity_id = a.id
        WHERE oa.interest_tag = $1 AND oa.environment_tag = $2
        LIMIT 1
      )
      UNION
      (
        SELECT
            oa.id,
            oa.title,
            oa.image_url,
            oa.base_activity_id,
            a.difficulty,
            a.required_materials
        FROM public.onboarding_activities AS oa
        JOIN public.activities AS a ON oa.base_activity_id = a.id
        WHERE oa.interest_tag = $1 OR oa.environment_tag = $2
        ORDER BY random()
        LIMIT 5
      )
      LIMIT 3;
      `,
      [interest, environment]
    );

    return res.json({ items: recommendations });
  } catch (err: any) {
    console.error("Recommendations error:", err?.message || err);
    return res.status(500).json({ error: "Failed to compute recommendations", detail: err?.message });
  }
}