import express from "express";
import cors from "cors";
import { Pool } from "pg";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const DATABASE_URL = process.env.NEON_DATABASE_URL as string;
if (!DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error("NEON_DATABASE_URL env var is required");
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Create session with secret
app.post("/api/session", async (_req, res) => {
  try {
    const sessionSecret = crypto.randomBytes(16).toString("hex");
    const { rows } = await pool.query(
      "INSERT INTO public.onboarding_sessions (session_secret) VALUES ($1) RETURNING id, session_secret",
      [sessionSecret]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Create session error:", err);
    res.status(500).json({ error: "Failed to create session", detail: (err as any)?.message });
  }
});

// Get session by id (requires secret)
app.get("/api/session/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const secret = (req.headers["x-session-secret"] as string) || (req.query.secret as string);
    if (!secret) return res.status(401).json({ error: "Missing session secret" });
    const { rows } = await pool.query(
      "SELECT * FROM public.onboarding_sessions WHERE id = $1 AND session_secret = $2",
      [id, secret]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Get session error:", err);
    res.status(500).json({ error: "Failed to fetch session", detail: (err as any)?.message });
  }
});

// Patch session by id (requires secret)
app.patch("/api/session/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const secret = (req.headers["x-session-secret"] as string) || (req.query.secret as string);
    if (!secret) return res.status(401).json({ error: "Missing session secret" });
    const { materials, environment, interest, completed } = req.body || {};

    const fields: string[] = [];
    const values: any[] = [];

    if (materials !== undefined) {
      fields.push("materials = $" + (values.length + 1));
      values.push(JSON.stringify(materials));
    }
    if (environment !== undefined) {
      fields.push("environment = $" + (values.length + 1));
      values.push(environment);
    }
    if (interest !== undefined) {
      fields.push("interest = $" + (values.length + 1));
      values.push(interest);
    }
    if (completed !== undefined) {
      fields.push("completed = $" + (values.length + 1));
      values.push(Boolean(completed));
    }

    if (fields.length === 0) return res.status(400).json({ error: "No updates provided" });

    // updated_at trigger will handle timestamp
    const query = `UPDATE public.onboarding_sessions SET ${fields.join(", ")} WHERE id = $${
      values.length + 1
    } AND session_secret = $${values.length + 2} RETURNING *`;
    values.push(id, secret);

    const { rows } = await pool.query(query, values);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Patch session error:", err);
    res.status(500).json({ error: "Failed to update session", detail: (err as any)?.message });
  }
});

// Debug endpoint to verify DB connectivity
app.get("/api/debug/db", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT now() as now");
    res.json({ ok: true, now: rows[0].now, hasUrl: !!DATABASE_URL });
  } catch (err) {
    console.error("DB debug error:", err);
    res.status(500).json({ ok: false, error: (err as any)?.message, hasUrl: !!DATABASE_URL });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on :${PORT}`);
});
