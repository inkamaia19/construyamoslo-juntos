import { Pool } from 'pg';

// Neon connection:
// Usa tu propia DATABASE_URL que ya tienes en .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper para queries
async function query(sql: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// ---------------------------
// SESSION FLOW
// ---------------------------

export async function createSession() {
  const id = crypto.randomUUID();
  const secret = crypto.randomUUID();

  await query(
    `INSERT INTO onboarding_sessions (id, session_secret)
     VALUES ($1, $2)`,
    [id, secret]
  );

  return { id, session_secret: secret };
}

export async function getSessionById(id: string, secret: string) {
  const rows = await query(
    `SELECT * FROM onboarding_sessions
     WHERE id = $1 AND session_secret = $2`,
    [id, secret]
  );

  return rows[0] || null;
}

export async function updateSession(id: string, updates: any, secret: string) {
  // Creamos un set dinámico
  const keys = Object.keys(updates);
  const values = Object.values(updates);

  const setString = keys.map((k, i) => `${k} = $${i + 3}`).join(", ");

  const rows = await query(
    `
    UPDATE onboarding_sessions
    SET ${setString}
    WHERE id = $1 AND session_secret = $2
    RETURNING *;
    `,
    [id, secret, ...values]
  );

  return rows[0] || null;
}

// ---------------------------
// DATA TABLES
// ---------------------------

export async function getMaterials() {
  return await query(`SELECT * FROM materials`);
}

export async function getEnvironments() {
  return await query(`SELECT * FROM environments`);
}

export async function getInterests() {
  return await query(`SELECT * FROM interests`);
}

export async function getActivityById(id: string) {
  const rows = await query(
    `SELECT * FROM activities WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function updateActivity(id: string, updates: any) {
  const keys = Object.keys(updates);
  const values = Object.values(updates);

  const setString = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");

  const rows = await query(
    `
    UPDATE activities
    SET ${setString}
    WHERE id = $1
    RETURNING *;
    `,
    [id, ...values]
  );

  return rows[0] || null;
}
