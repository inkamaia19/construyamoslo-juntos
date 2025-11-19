import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getActivityById, updateActivity } from '../../src/lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const act = await getActivityById(id as string);
    return res.status(200).json(act);
  }

  if (req.method === "PATCH") {
    const updated = await updateActivity(id as string, req.body);
    return res.status(200).json(updated);
  }

  return res.status(405).end();
}
