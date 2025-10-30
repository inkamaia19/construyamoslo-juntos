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
    const { materials, environment, interest, completed, child_age, child_name, time_available } = req.body || {};

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
    if (child_age !== undefined) {
      fields.push("child_age = $" + (values.length + 1));
      values.push(child_age === null ? null : Number(child_age));
    }
    if (child_name !== undefined) {
      fields.push("child_name = $" + (values.length + 1));
      values.push(child_name);
    }
    if (time_available !== undefined) {
      fields.push("time_available = $" + (values.length + 1));
      values.push(time_available);
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

// Recommendation endpoint: compute activities based on session data
app.get("/api/recommendations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const secret = (req.headers["x-session-secret"] as string) || (req.query.secret as string);
    if (!secret) return res.status(401).json({ error: "Missing session secret" });

    // Get session context
    const { rows: srows } = await pool.query(
      "SELECT materials, environment, interest, child_age, time_available FROM public.onboarding_sessions WHERE id = $1 AND session_secret = $2",
      [id, secret]
    );
    if (!srows[0]) return res.status(404).json({ error: "Session not found" });

    const session = srows[0] as any;
    const materials: Array<{ id: string; state?: string }> = Array.isArray(session.materials) ? session.materials : [];
    const functional = new Set(
      materials.filter((m) => m.state === "functional" || m.state === "semi_functional").map((m) => m.id)
    );
    const interest: string | null = session.interest;
    const environment: string | null = session.environment;
    const childAge: number | null = session.child_age ?? null;
    const timeAvail: string | null = session.time_available ?? null; // short|medium|long

    // Try to fetch activities from DB; fallback to built-in list
    let activities: Array<any> = [];
    try {
      const { rows } = await pool.query("SELECT id, title, difficulty, required_materials, interests, environments FROM public.activities");
      activities = rows;
    } catch (_) {
      activities = [
        {
          id: "water-colors",
          title: "Explora colores con agua",
          difficulty: "fácil",
          required_materials: ["paint", "bottles"],
          interests: ["water_bubbles", "art_coloring"],
          environments: ["table", "garden"],
        },
        {
          id: "bottle-sounds",
          title: "Crea sonidos con botellas",
          difficulty: "fácil",
          required_materials: ["bottles", "sticks"],
          interests: ["sounds_rhythm", "discover"],
          environments: ["living_room", "garden"],
        },
        {
          id: "cardboard-construction",
          title: "Construye con cartón",
          difficulty: "medio",
          required_materials: ["cardboard", "scissors"],
          interests: ["building", "art_coloring"],
          environments: ["table", "floor"],
        },
      ];
    }

    // Scoring
    const scored = activities
      .map((a) => {
        const req: string[] = Array.isArray(a.required_materials) ? a.required_materials : [];
        const matRatio = req.length ? req.filter((m) => functional.has(m)).length / req.length : 0;
        const interestMatch = Array.isArray(a.interests) && interest ? a.interests.includes(interest) : false;
        const envMatch = Array.isArray(a.environments) && environment ? a.environments.includes(environment) : false;
        // Age/time adjustments
        let ageAdj = 0;
        let timeAdj = 0;
        const diff = (a.difficulty || '').toLowerCase();
        if (childAge != null) {
          if (childAge < 4 && diff === 'avanzado') ageAdj -= 0.2;
          if (childAge < 3 && diff === 'medio') ageAdj -= 0.1;
        }
        if (timeAvail) {
          if (timeAvail === 'short' && diff === 'avanzado') timeAdj -= 0.15;
        }
        const score = matRatio * 0.5 + (interestMatch ? 0.35 : 0) + (envMatch ? 0.15 : 0) + ageAdj + timeAdj;
        return { ...a, score };
      })
      .sort((x, y) => y.score - x.score)
      .slice(0, 3);

    res.json({ items: scored });
  } catch (err) {
    console.error("Recommendations error:", err);
    res.status(500).json({ error: "Failed to compute recommendations", detail: (err as any)?.message });
  }
});

// Public activity details
app.get("/api/activity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT id, title, difficulty, required_materials, optional_materials, objective,
              duration_minutes, age_min, age_max, steps, tips, safety
         FROM public.activities WHERE id = $1`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Activity details error:", err);
    res.status(500).json({ error: "Failed to fetch activity", detail: (err as any)?.message });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on :${PORT}`);
});
