
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "./db";
import * as schema from "@shared/schema";

const db = drizzle(pool, { schema });

async function runMigration() {
  console.log("Running migrations...");
  
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigration();
