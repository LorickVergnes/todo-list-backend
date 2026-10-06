import pg from 'pg';

// La connexion est configurée par les variables PGHOST, PGPORT, PGUSER, PGPASSWORD et PGDATABASE
export const pool = new pg.Pool();
