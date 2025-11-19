import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSessionById, updateSession } from '../../src/lib/db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const secret = req.headers["x-session-secret"] as string;

  if (req.method === "GET") {
    const session = await getSessionById(id as string, secret);
    if (!session) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(session);
  }

  if (req.method === "PATCH") {
    const updated = await updateSession(id as string, req.body, secret);
    return res.status(200).json(updated);
  }

  return res.status(405).end();
}
