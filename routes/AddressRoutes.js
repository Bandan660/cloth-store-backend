import express from "express";
import {
  createAddress,
  getAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAddressByUserId
} from "../controller/AddressController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
const router = express.Router();
router.get("/", AuthMiddleware, getAddress);
router.get("/:id", AuthMiddleware, getAddressById);

router.post("/addAddress", AuthMiddleware, createAddress);
router.put("/editAddress/:id", AuthMiddleware, updateAddress);
router.get("/getAddressByUserId/:Id", AuthMiddleware, getAddressByUserId);
router.delete("/deleteAddress/:id", AuthMiddleware, deleteAddress);

export default router;
