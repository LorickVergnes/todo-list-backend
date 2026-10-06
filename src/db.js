import { readFile } from 'node:fs/promises';
import pg from 'pg';

// DATABASE_URL est fournie par les hébergeurs (Render) ; sinon la connexion est configurée
// par les variables PGHOST, PGPORT, PGUSER, PGPASSWORD et PGDATABASE
export const pool = new pg.Pool(
  process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {},
);

// Sur une base gérée, db/init.sql n'est pas exécuté par l'image Postgres : l'API crée donc
// elle-même la table au démarrage (le script ne fait rien si elle existe déjà)
export async function initSchema() {
  const sql = await readFile(new URL('../db/init.sql', import.meta.url), 'utf8');
  await pool.query(sql);
}
