import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSessionById } from '../../src/lib/db';
import { generateRecommendations } from '../../src/lib/recommendationEngine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  const secret = req.headers["x-session-secret"] as string;

  const session = await getSessionById(id as string, secret);
  if (!session) return res.status(404).json({ error: "Invalid session" });

  const items = await generateRecommendations(session);
  return res.status(200).json({ items });
}
