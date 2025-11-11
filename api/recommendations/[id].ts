import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPool } from "../_db";

const fallbackActivities = [
  {
    id: "water-colors",
    title: "Explora colores con agua",
    difficulty: "fácil",
    required_materials: ["paint", "bottles"],
    interests: ["water_bubbles", "art_coloring"],
    environments: ["table", "garden"],
    image_url: "/assets/activity-water-colors.jpg",
  },
  {
    id: "bottle-sounds",
    title: "Crea sonidos con botellas",
    difficulty: "fácil",
    required_materials: ["bottles", "sticks"],
    interests: ["sounds_rhythm", "discover"],
    environments: ["living_room", "garden"],
    image_url: "/assets/activity-sounds.jpg",
  },
  {
    id: "cardboard-construction",
    title: "Construye con cartón",
    difficulty: "medio",
    required_materials: ["cardboard", "scissors"],
    interests: ["building", "art_coloring"],
    environments: ["table", "floor"],
    image_url: "/assets/activity-building.jpg",
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const pool = getPool();
  const { id } = req.query as { id: string };
  const secret = (req.headers["x-session-secret"] as string) || (req.query.secret as string);
  if (!id) return res.status(400).json({ error: "Missing id" });
  if (!secret) return res.status(401).json({ error: "Missing session secret" });

  try {
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
    const timeAvail: string | null = session.time_available ?? null;

    let activities: any[] = [];
    try {
      const { rows } = await pool.query(
        "SELECT id, title, difficulty, required_materials, interests, environments, image_url FROM public.activities"
      );
      activities = rows;
    } catch (dbError: any) {
      console.error("Failed to fetch activities from DB, using fallback:", dbError?.message);
      activities = fallbackActivities;
    }

    const scored = activities
      .map((a) => {
        const req: string[] = Array.isArray(a.required_materials) ? a.required_materials : [];
        const matRatio = req.length ? req.filter((m) => functional.has(m)).length / req.length : 0;
        const interestMatch = Array.isArray(a.interests) && interest ? a.interests.includes(interest) : false;
        const envMatch = Array.isArray(a.environments) && environment ? a.environments.includes(environment) : false;
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

    return res.json({ items: scored });
  } catch (err: any) {
    console.error("Recommendations error:", err?.message || err);
    return res.status(500).json({ error: "Failed to compute recommendations", detail: err?.message });
  }
}