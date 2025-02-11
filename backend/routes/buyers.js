import express from "express";
const router = express.Router();
import buyerController from "../controllers/buyerController.js";

router.post("/signup", buyerController.createBuyer);
router.get("/all-orders/:id", buyerController.getAllOrders);

export default router;
