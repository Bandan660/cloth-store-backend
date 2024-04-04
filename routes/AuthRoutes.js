import express from "express";
import registerUser from "../controller/UserController.js";

const router = express.Router();

// all router
router.post("/register", registerUser);
export default router;
