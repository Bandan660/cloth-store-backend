import express from "express";
import {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory
} from "../controller/CategoryController.js";
import { AuthMiddleware, isAdmin } from "../middleware/AuthMiddleware.js";
const router = express.Router();
//importing the model of our data base

router.post("/createcategory", AuthMiddleware, isAdmin, createCategory);
router.put("/editcategory/:id", AuthMiddleware, isAdmin, updateCategory);
router.get("/allcategory", getAllCategory);
router.get("/:id", getSingleCategory);
router.delete("/deletecategory/:id", AuthMiddleware, isAdmin, deleteCategory);

export default router;
