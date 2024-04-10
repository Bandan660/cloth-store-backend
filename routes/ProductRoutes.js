import express from "express";
import {
  addToWishlist,
  createNewProduct,
  deleteProductByID,
  getAllProducts,
  getSingleProductById,
  
  rating,
  updateProductById,
  uploadImages,
} from "../controller/ProductController.js";
import { AuthMiddleware, isAdmin } from "../middleware/AuthMiddleware.js";
import { productImgResize, uploadPhoto } from "../middleware/UploadImages.js";

const router = express.Router();

// All product routes
router.get("/all", getAllProducts);
router.get("/:id", getSingleProductById);
router.post("/create", AuthMiddleware, isAdmin, createNewProduct);
router.put(
  "/upload/:id",
  AuthMiddleware,
  isAdmin,
  uploadPhoto.array("images", 8),
  productImgResize,
  uploadImages
);
router.put("/updateproduct/:id", AuthMiddleware, isAdmin, updateProductById);
router.delete("/deleteproduct/:id", deleteProductByID);

router.put("/wishlist", AuthMiddleware, addToWishlist); //add to wishlist route
router.post("/rating", AuthMiddleware, rating); //rate a product route

export default router;
