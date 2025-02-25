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
    latitude,
    longitude,
  } = req.body;

  try {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new buyer into the database with coordinates
    const result = await pool.query(
      `INSERT INTO buyers (
        company_name, 
        email, 
        phone, 
        address, 
        city, 
        state, 
        password_hash,
        latitude,
        longitude,
        location_updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP) 
      RETURNING *`,
      [
        companyName,
        email,
        phone,
        address,
        city,
        state,
        passwordHash,
        latitude,
        longitude,
      ]
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

    // More specific error handling
    if (err.code === "23505" && err.constraint === "buyers_email_key") {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Handle invalid coordinates
    if (err.code === "23514") {
      // Check constraint violation
      return res.status(400).json({ error: "Invalid coordinates provided" });
    }

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
