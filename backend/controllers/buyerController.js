import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createBuyer = async (req, res) => {
  const {
    companyName,
    email,
    phone,
    address,
    city,
    state,
    password,
  } = req.body;

  try {
    // Hash the password
    const saltRounds = 10; // Number of salt rounds for hashing
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new buyer into the database
    const result = await pool.query(
      "INSERT INTO buyers (company_name, email, phone, address, city, state, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [companyName, email, phone, address, city, state, passwordHash]
    );

    const buyer = result.rows[0];

    const token = jwt.sign(
      { email: buyer.email, id: buyer.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send the created buyer as a response
    res.status(201).json({ token, customer: buyer });
  } catch (err) {
    console.error("Error creating buyer:", err);
    res.status(500).json({ error: "Failed to create buyer" });
  }
};

const getAllOrders = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch all orders for the buyer
    const result = await pool.query(
      "SELECT * FROM orders WHERE buyer_id = $1",
      [id]
    );

    const orders = result.rows;

    // Send the orders as a response
    res.status(200).json({ orders: orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getNearbySellers = async (req, res) => {
  const { latitude, longitude, radius = 10 } = req.query; // radius in kilometers

  try {
    const result = await pool.query(
      `SELECT 
        id, address, city, state,
        latitude, longitude,
        ( 6371 * acos( cos( radians($1) ) 
          * cos( radians(latitude) ) 
          * cos( radians(longitude) - radians($2) ) 
          + sin( radians($1) ) 
          * sin( radians(latitude) ) ) ) AS distance
       FROM sellers
       WHERE latitude IS NOT NULL
       AND longitude IS NOT NULL
       HAVING distance < $3
       ORDER BY distance`,
      [latitude, longitude, radius]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error finding nearby sellers:", error);
    res.status(500).json({ error: "Failed to find nearby sellers" });
  }
};

export default {
  createBuyer,
  getAllOrders,
  getNearbySellers,
};
