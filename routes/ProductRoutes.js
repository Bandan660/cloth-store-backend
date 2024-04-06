import express from "express";
import {
  createNewProduct,
  deleteProductByID,
  getAllProducts,
  getSingleProductById,
  updateProductById,
} from "../controller/ProductController.js";
import { AuthMiddleware, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All product routes
router.get("/all", getAllProducts);
router.get("/:id", getSingleProductById);
router.post("/create", AuthMiddleware,isAdmin,createNewProduct);
router.put("/updateproduct/:id", AuthMiddleware,isAdmin,updateProductById);
router.delete("/deleteproduct/:id", deleteProductByID);

export default router;
