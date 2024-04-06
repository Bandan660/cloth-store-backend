import express from "express";
import {
  loginUser,
  registerUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  handleRefreshToken,
  logoutUser,
} from "../controller/UserController.js";
import { AuthMiddleware, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// all router
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getallusers", AuthMiddleware, getAllUser);
router.get("/userdetails/:id", AuthMiddleware, getUserById);
router.put("/updateuser/:id", AuthMiddleware, updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.get("/refreshtoken", handleRefreshToken);

export default router;
