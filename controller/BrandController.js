import { Brand } from "../models/BrandModel.js";
import expressAsyncHandler from "express-async-handler";
// create Brands
const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json({ message: "New Brand created successfully", newBrand });
  } catch (error) {
    throw new Error(error);
  }
});

// get all Brands
const getAllBrand = expressAsyncHandler(async (req, res) => {
  try {
    const brand = await Brand.find();
    res.json({ message: "All brands", brand });
  } catch (error) {
    throw new Error(error);
  }
});

// get single Brands
const getSingleBrand = expressAsyncHandler(async (req, res) => {
  try {
    const singleBrand = await Brand.findById(req.params.id);
    if (!singleBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ message: "Brand found", singleBrand });
  } catch (error) {
    throw new Error(error);
  }
});

// update brand
const updateBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const newbrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!newbrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ message: "Brand updated successfully", newbrand });
  } catch (error) {
    throw new Error(error);
  }
});
// delete Brand
const deleteBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedbrand = await Brand.findByIdAndDelete(id);
    if (!deletedbrand) {
      return res.status(404).json({ message: "brand not found" });
    }
    res.json({ message: "brand deleted successfully", deletedbrand });
  } catch (error) {
    throw new Error(error);
  }
});

export { createBrand, updateBrand, getAllBrand, deleteBrand, getSingleBrand };
