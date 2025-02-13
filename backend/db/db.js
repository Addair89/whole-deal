import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

// Parse the DB_URL from Neon
const connectionString = process.env.DATABASE_URL;
console.log("DB_URL", connectionString);

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

export default pool;
