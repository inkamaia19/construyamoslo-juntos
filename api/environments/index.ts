import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getEnvironments } from '../../src/lib/db.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const env = await getEnvironments();
  return res.status(200).json({ environments: env });
}
