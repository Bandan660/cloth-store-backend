import createPaymentIntent from "../controller/PaymentController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/create", AuthMiddleware, createPaymentIntent);

export default router;
