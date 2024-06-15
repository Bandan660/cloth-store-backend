import express from "express";
import {
  addToWishlist,
  createNewProduct,
  deleteProductByID,
  getAllProducts,
  getSingleProductById,
  rating,
  updateProductById,
} from "../controller/ProductController.js";
import { AuthMiddleware, isAdmin } from "../middleware/AuthMiddleware.js";

import { handleImageUpload } from "../middleware/MulterMiddleware.js";

const router = express.Router();

// All product routes
router.get("/all", getAllProducts);
router.get("/:id", getSingleProductById);
router.post(
  "/create",
  handleImageUpload,
  AuthMiddleware,
  isAdmin,


  createNewProduct
);
router.put("/upload/:id", AuthMiddleware, isAdmin);
router.put("/updateproduct/:id", AuthMiddleware, isAdmin, updateProductById);
router.delete("/deleteproduct/:id", deleteProductByID);

router.put("/wishlist", AuthMiddleware, addToWishlist); //add to wishlist route
router.post("/rating", AuthMiddleware, rating); //rate a product route

export default router;
