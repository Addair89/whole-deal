import express from "express";
const router = express.Router();
import buyerController from "../controllers/buyerController.js";

router.post("/signup", buyerController.createBuyer);
router.get("/all-orders/:id", buyerController.getAllOrders);
router.get("/nearby-sellers", buyerController.getNearbySellers);

export default router;
