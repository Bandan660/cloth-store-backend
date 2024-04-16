import { AllOrder, cancelOrder, createOrder, orderDetails, orderbyUser, returnOrder, updateOrderstatus,updatePaymentStatus } from "../controller/OrderController.js";
import express from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/createOrder", AuthMiddleware, createOrder);
router.get("/allorder",AuthMiddleware , AllOrder);
router.get("/userorders/:id", AuthMiddleware, orderbyUser);
router.get("/:id",AuthMiddleware, orderDetails);
router.put("/status/:id", AuthMiddleware, updateOrderstatus);
router.put("/payment/:id", AuthMiddleware, updatePaymentStatus);
router.put("/cancel/:id", AuthMiddleware, cancelOrder);
router.put ("/return/:id", AuthMiddleware, returnOrder)

export default router;