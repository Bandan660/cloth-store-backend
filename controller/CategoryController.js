import { category } from "../models/CategoryModel.js";
import expressAsyncHandler from "express-async-handler";
// create category
const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const newcategory = await category.create(req.body);
    res.json({ message: "category created successfully", newcategory });
  } catch (error) {
    throw new Error(error);
  }
});

// get all category
const getAllCategory = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await category.find();
    res.json({ message: "All categories", categories });
  } catch (error) {
    throw new Error(error);
  }
});

// get single category
const getSingleCategory = expressAsyncHandler(async (req, res) => {
  try {
    const singlecategory = await category.findById(req.params.id);
    if (!singlecategory) {
      return res.status(404).json({ message: "category not found" });
    }
    res.json({ message: "category found", singlecategory });
  } catch (error) {
    throw new Error(error);
  }
});

// update category
const updateCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const newcategory = await category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!newcategory) {
      return res.status(404).json({ message: "category not found" });
    }
    res.json({ message: "category updated successfully", newcategory });
  } catch (error) {
    throw new Error(error);
  }
});
// delete category
const deleteCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedcategory = await category.findByIdAndDelete(id);
    if (!deletedcategory) {
      return res.status(404).json({ message: "category not found" });
    }
    res.json({ message: "category deleted successfully", deletedcategory });
  } catch (error) {
    throw new Error(error);
  }
});

export {
  createCategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
  getSingleCategory,
};
