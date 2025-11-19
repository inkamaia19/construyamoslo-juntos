import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMaterials } from '../../src/lib/db';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const materials = await getMaterials();
  return res.status(200).json({ materials });
}
