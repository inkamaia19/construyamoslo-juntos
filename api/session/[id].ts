import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_lib/db.js"; // <-- AÑADIR .js

// ... el resto del archivo se mantiene igual ...
// Helper para mapear claves camelCase a snake_case y definir sus tipos
const fieldMapping: Record<string, { key: string; type: 'string' | 'number' | 'boolean' | 'json' }> = {
  materials: { key: "materials", type: "json" },
  environment: { key: "environment", type: "string" },
  interest: { key: "interest", type: "string" },
  completed: { key: "completed", type: "boolean" },
  child_age: { key: "child_age", type: "number" },
  childAge: { key: "child_age", type: "number" },
  child_name: { key: "child_name", type: "string" },
  childName: { key: "child_name", type: "string" },
  time_available: { key: "time_available", type: "string" },
  timeAvailable: { key: "time_available", type: "string" },
  parent_email: { key: "parent_email", type: "string" },
  parentEmail: { key: "parent_email", type: "string" },
  parent_context: { key: "parent_context", type: "string" },
  parentContext: { key: "parent_context", type: "string" },
  parent_first_name: { key: "parent_first_name", type: "string" },
  parentFirstName: { key: "parent_first_name", type: "string" },
  parent_last_name: { key: "parent_last_name", type: "string" },
  parentLastName: { key: "parent_last_name", type: "string" },
  parent_phone: { key: "parent_phone", type: "string" },
  parentPhone: { key: "parent_phone", type: "string" },
};

function processValue(value: any, type: string) {
  if (value === undefined) return undefined;
  switch (type) {
    case 'json': return JSON.stringify(value);
    case 'boolean': return Boolean(value);
    case 'number': return value === null ? null : Number(value);
    default: return value;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  // ... el resto del archivo se mantiene igual ...
  const { id } = req.query as { id: string };
  const secret = (req.headers["x-session-secret"] as string) || (req.query.secret as string);

  if (!id) return res.status(400).json({ error: "Missing id" });
  if (!secret) return res.status(401).json({ error: "Missing session secret" });

  if (req.method === "GET") {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM public.onboarding_sessions WHERE id = $1 AND session_secret = $2",
        [id, secret]
      );
      if (!rows[0]) return res.status(404).json({ error: "Not found" });
      return res.json(rows[0]);
    } catch (err: any) {
      console.error("Get session error:", err?.message || err);
      return res.status(500).json({ error: "Failed to fetch session", detail: err?.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      
      const fields: string[] = [];
      const values: any[] = [];
      const seenDbKeys = new Set<string>();
      
      for (const key in body) {
        if (fieldMapping[key]) {
          const { key: dbKey, type } = fieldMapping[key];
          if (!seenDbKeys.has(dbKey)) {
            const value = processValue(body[key], type);
            if (value !== undefined) {
              fields.push(`${dbKey} = $${values.length + 1}`);
              values.push(value);
              seenDbKeys.add(dbKey);
            }
          }
        }
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
      return res.status(500).json({ error: "Failed to update session", detail: err?.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}