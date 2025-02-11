import express from "express";
import cors from "cors";
import sellerRoutes from "./routes/sellers.js";
import buyerRoutes from "./routes/buyers.js";
import userRoutes from "./routes/users.js";
import pool from "./db/db.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/sellers", sellerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/buyers", buyerRoutes);

app.get("/test-db-buyers", async (req, res) => {
  try {
    // Run a simple query to test the connection
    const result = await pool.query("SELECT * FROM buyers");
    res.json({ message: "Database connection successful!", data: result.rows });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
});

app.get("/test-db-sellers", async (req, res) => {
  try {
    // Run a simple query to test the connection
    const result = await pool.query("SELECT * FROM sellers");
    res.json({ message: "Database connection successful!", data: result.rows });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
