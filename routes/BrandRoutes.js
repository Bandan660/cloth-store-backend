import express from "express";
import {
  createBrand,
  updateBrand,
  getAllBrand,
  deleteBrand,
  getSingleBrand,
} from "../controller/BrandController.js";
import { AuthMiddleware, isAdmin } from "../middleware/AuthMiddleware.js";
const router = express.Router();
//importing the model of our data base

router.post("/createbrand", AuthMiddleware, isAdmin, createBrand);
router.put("/editbrand/:id", AuthMiddleware, isAdmin, updateBrand);
router.get("/", getAllBrand);
router.get("/:id", getSingleBrand);
router.delete("/deletebrand/:id", AuthMiddleware, isAdmin, deleteBrand);


export default router;
