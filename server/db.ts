import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Use connection pooling URL
const poolConfig = {
  connectionString: process.env.DATABASE_URL.replace('.postgres.', '-pooler.postgres.'),
  max: 20
};

export const pool = new pg.Pool(poolConfig);
export const db = drizzle(pool, { schema });