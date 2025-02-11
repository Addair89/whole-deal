import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createSeller = async (req, res) => {
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
      "INSERT INTO sellers (company_name, email, phone, address, city, state, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [companyName, email, phone, address, city, state, passwordHash]
    );

    const newSeller = result.rows[0];

    // Create a JWT token
    const token = jwt.sign(
      { email: newSeller.email, id: newSeller.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send the created buyer as a response
    res.status(201).json({ token, customer: newSeller });
  } catch (err) {
    console.error("Error creating seller:", err);
    res.status(500).json({ error: "Failed to create seller" });
  }
};

const getNextDayOrders = async (req, res) => {
  try {
    const sellerId = req.params.id;
    if (isNaN(sellerId)) {
      return res.status(400).json({ error: "Invalid seller ID" });
    }

    const result = await pool.query(
      "SELECT * FROM orders WHERE seller_id = $1 AND delivery_date = CURRENT_DATE + INTERVAL '1 day'",
      [sellerId]
    );

    const orders = result.rows;

    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: "No orders for the next day", orders: [] });
    }

    res
      .status(200)
      .json({ message: "Testing JSON response", orders: [orders] });
  } catch (err) {
    console.error("Error fetching next day orders:", err);
    res.status(500).json({ error: "Failed to fetch next day orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const sellerId = req.params.id;
    if (isNaN(sellerId)) {
      return res.status(400).json({ error: "Invalid seller ID" });
    }

    const result = await pool.query(
      "SELECT * FROM orders WHERE seller_id = $1",
      [sellerId]
    );

    const orders = result.rows;

    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: "No orders found for this seller", orders: [] });
    }

    res
      .status(200)
      .json({ message: "Testing JSON response", orders: [orders] });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};

const getAllProducts = async (req, res) => {
  const sellerId = req.params.id;
  if (isNaN(sellerId)) {
    return res.status(400).json({ error: "Invalid seller ID" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE seller_id = $1",
      [sellerId]
    );

    const products = result.rows;

    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: "No products found for this seller", products: [] });
    }

    res
      .status(200)
      .json({ message: "Testing JSON response", products: products });
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: "Failed to fetch all products" });
  }
};

const addProduct = async (req, res) => {
  console.log("REQ>BODY", req.body);
  try {
    const { name, description, price, seller_id } = req.body;

    // Validate price
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({ error: "Invalid price format" });
    }

    const result = await pool.query(
      "INSERT INTO products (name, description, price, seller_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, numericPrice, seller_id]
    );

    const newProduct = result.rows[0];
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

const deleteProduct = async (req, res) => {
  const productID = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [productID]
    );
    const deletedProduct = result.rows[0];
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Deleted product:", deletedProduct);
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

const updateProduct = async (req, res) => {
  const productID = req.params.id;
  console.log("REQ>BODY--------", req.body);
  try {
    const { name, description, price } = req.body;
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({ error: "Invalid price format" });
    }

    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [name, description, numericPrice, productID]
    );

    const updatedProduct = result.rows[0];
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Updated product----------:", updatedProduct);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

const getPastOrders = async (req, res) => {};
const getOrderDetails = async (req, res) => {}; // ✅ Fetch a specific order
const updateOrderStatus = async (req, res) => {}; // ✅ Mark orders as "shipped" or "delivered"
const cancelOrder = async (req, res) => {}; // ✅ Allow order cancellation

const updateProductStock = async (req, res) => {}; // ✅ Update inventory levels
const getLowStockProducts = async (req, res) => {}; // ✅ Get products that need restocking
const toggleProductAvailability = async (req, res) => {}; // ✅ Show/hide product without deleting

const getSalesReport = async (req, res) => {}; // ✅ Sales data over time
const getTopSellingProducts = async (req, res) => {}; // ✅ Identify best-selling items
const getCustomerList = async (req, res) => {}; // ✅ Fetch customers who bought from this seller

export default {
  getPastOrders,
  getNextDayOrders,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getLowStockProducts,
  toggleProductAvailability,
  getSalesReport,
  getTopSellingProducts,
  getCustomerList,
  createSeller,
};
