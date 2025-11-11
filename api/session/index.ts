import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { getPool } from "../_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  if (req.method === "POST") {
    try {
      const sessionSecret = crypto.randomBytes(16).toString("hex");
      const { rows } = await pool.query(
        "INSERT INTO public.onboarding_sessions (session_secret) VALUES ($1) RETURNING id, session_secret",
        [sessionSecret]
      );
      return res.status(201).json(rows[0]);
    } catch (err: any) {
      console.error("Create session error:", err?.message || err);
      return res.status(500).json({ error: "Failed to create session", detail: err?.message });
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
}