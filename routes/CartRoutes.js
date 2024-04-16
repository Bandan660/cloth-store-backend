import express from "express";
import {
  addToCart,
  removeFromCart,
  getCartDetails,
} from "../controller/CartController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/add-to-cart", AuthMiddleware, addToCart);
router.delete("/remove/:id", AuthMiddleware, removeFromCart);

router.get("/get-cart-details", AuthMiddleware, getCartDetails);

export default router;
