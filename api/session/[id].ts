import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  const { id } = req.query as { id: string };
  const secret = (req.headers["x-session-secret"] as string) || (req.query.secret as string);

  if (!id) return res.status(400).json({ error: "Missing id" });

  if (req.method === "GET") {
    try {
      if (!secret) return res.status(401).json({ error: "Missing session secret" });
      const { rows } = await pool.query(
        "SELECT * FROM public.onboarding_sessions WHERE id = $1 AND session_secret = $2",
        [id, secret]
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      return res.json(rows[0]);
    } catch (err: any) {
      console.error("Get session error:", err?.message || err);
      return res.status(500).json({ error: "Failed to fetch session" });
    }
  }

  if (req.method === "PATCH") {
    try {
      if (!secret) return res.status(401).json({ error: "Missing session secret" });
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const {
        materials,
        environment,
        interest,
        completed,
        child_age,
        childAge,
        child_name,
        childName,
        time_available,
        timeAvailable,
        parent_email,
        parentEmail,
        parent_context,
        parentContext,
        parent_first_name,
        parentFirstName,
        parent_last_name,
        parentLastName,
        parent_phone,
        parentPhone,
      } = body;

      const fields: string[] = [];
      const values: any[] = [];
      if (materials !== undefined) {
        fields.push(`materials = $${values.length + 1}`);
        values.push(JSON.stringify(materials));
      }
      if (environment !== undefined) {
        fields.push(`environment = $${values.length + 1}`);
        values.push(environment);
      }
      if (interest !== undefined) {
        fields.push(`interest = $${values.length + 1}`);
        values.push(interest);
      }
      if (completed !== undefined) {
        fields.push(`completed = $${values.length + 1}`);
        values.push(Boolean(completed));
      }
      const ageVal = child_age ?? childAge;
      if (ageVal !== undefined) {
        fields.push(`child_age = $${values.length + 1}`);
        values.push(ageVal === null ? null : Number(ageVal));
      }
      const nameVal = child_name ?? childName;
      if (nameVal !== undefined) {
        fields.push(`child_name = $${values.length + 1}`);
        values.push(nameVal);
      }
      const timeVal = time_available ?? timeAvailable;
      if (timeVal !== undefined) {
        fields.push(`time_available = $${values.length + 1}`);
        values.push(timeVal);
      }

      const pEmail = parent_email ?? parentEmail;
      if (pEmail !== undefined) {
        fields.push(`parent_email = $${values.length + 1}`);
        values.push(pEmail);
      }
      const pCtx = parent_context ?? parentContext;
      if (pCtx !== undefined) {
        fields.push(`parent_context = $${values.length + 1}`);
        values.push(pCtx);
      }
      const pFirst = parent_first_name ?? parentFirstName;
      if (pFirst !== undefined) {
        fields.push(`parent_first_name = $${values.length + 1}`);
        values.push(pFirst);
      }
      const pLast = parent_last_name ?? parentLastName;
      if (pLast !== undefined) {
        fields.push(`parent_last_name = $${values.length + 1}`);
        values.push(pLast);
      }
      const pPhone = parent_phone ?? parentPhone;
      if (pPhone !== undefined) {
        fields.push(`parent_phone = $${values.length + 1}`);
        values.push(pPhone);
      }

      if (fields.length === 0) return res.status(204).end();

      const query = `UPDATE public.onboarding_sessions SET ${fields.join(", ")} WHERE id = $${
        values.length + 1
      } AND session_secret = $${values.length + 2} RETURNING *`;
      values.push(id, secret);
      const { rows } = await pool.query(query, values);
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      return res.json(rows[0]);
    } catch (err: any) {
      console.error("Patch session error:", err?.message || err);
      return res.status(500).json({ error: "Failed to update session" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
