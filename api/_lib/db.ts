import { Pool } from "pg";

// Declara el pool fuera de la función para que persista entre invocaciones.
let pool: Pool | null = null;

export function getPool() {
  // Si el pool ya existe, devuélvelo inmediatamente.
  if (pool) {
    return pool;
  }

  const connectionString = process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Missing NEON_DATABASE_URL env var. Make sure it's configured in your Vercel project and pulled locally with `vercel env pull`."
    );
  }

  // Si no existe, créalo y guárdalo en la variable externa.
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return pool;
}