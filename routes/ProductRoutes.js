import express from "express";
import {
  createNewProduct,
  getAllProducts,
  getSingleProductById,
} from "../controller/ProductController.js";

const router = express.Router();

// All product routes
router.get("/all", getAllProducts);
router.get("/:id", getSingleProductById);
router.post("/create", createNewProduct);

export default router;
