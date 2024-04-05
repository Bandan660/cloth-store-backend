import express from "express";
import {
  loginUser,
  registerUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/UserController.js";
import { AuthMiddleware, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// all router
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getallusers", getAllUser);
router.get("/userdetails/:id", AuthMiddleware, isAdmin, getUserById);
router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
export default router;
