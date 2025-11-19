import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createSession } from '../../src/lib/db';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const session = await createSession();
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ error: "Could not create session" });
  }
}
