import { Pool } from "pg";

export function getPool() {
  const connectionString = process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Missing NEON_DATABASE_URL env var. Make sure it's configured in your Vercel project and pulled locally with `vercel env pull`."
    );
  }

  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}