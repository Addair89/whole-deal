import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email, "password", password);

  try {
    // Check if the user exists
    const result = await pool.query(
      `SELECT 'sellers' AS source, * FROM sellers WHERE email = $1
        UNION
        SELECT 'buyers' AS source, * FROM buyers WHERE email = $1
      `,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password is correct
    const passwordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!passwordCorrect) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { email: user.email, id: user.id, source: user.source, customer: user },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send the token as a response
    res.status(200).json({ token, customer: user, source: user.source });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ error: "Failed to log in user" });
  }
};

const updateLocation = async (req, res) => {
  const { street, city, state, userType, userId } = req.body;

  try {
    // Get coordinates for the address
    const { latitude, longitude } = await geocodeAddress(street, city, state);

    // Update the appropriate table based on user type
    const tableName = userType === "seller" ? "sellers" : "buyers";

    const result = await pool.query(
      `UPDATE ${tableName}
       SET latitude = $1, 
           longitude = $2, 
           location_updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [latitude, longitude, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({
      error: "Failed to update location",
      details: error.message,
    });
  }
};

export default {
  loginUser,
  updateLocation,
};
