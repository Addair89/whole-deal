import express from "express";
const router = express.Router();
import sellerController from "../controllers/sellerController.js";

router.post("/signup", sellerController.createSeller);
router.post("/add-product/", sellerController.addProduct);
router.get("/next-day-orders/:id", sellerController.getNextDayOrders);
router.get("/all-orders/:id", sellerController.getAllOrders);
router.get("/all-products/:id", sellerController.getAllProducts);
router.delete("/delete-product/:id", sellerController.deleteProduct);
router.put("/edit-product/:id", sellerController.updateProduct);

export default router;
