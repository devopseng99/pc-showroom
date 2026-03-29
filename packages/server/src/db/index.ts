import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString =
  process.env.DATABASE_URL || "postgres://showroom:showroom@localhost:5432/showroom";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
export { schema };
