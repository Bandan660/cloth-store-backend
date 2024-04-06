import { Product } from "../models/ProductModel.js";
import expressAsyncHandler from "express-async-handler";

// get all products
const getAllProducts = expressAsyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const products = await Product.where("category").equals(req.query.category);
    res.json({ message: "All products fetched successfully", products });
  } catch (error) {
    throw new Error(error);
  }
});
// get single product by id
const getSingleProductById = expressAsyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    throw new Error(error);
  }
});

// create the product
const createNewProduct = expressAsyncHandler(async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.json({ message: "product created successfully", product });
  } catch (error) {
    throw new Error(error);
  }
});
// update the product by id
const updateProductById = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    throw new Error(error);
  }
});

// delete the product by id
const deleteProductByID = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
};

export {
  getAllProducts,
  getSingleProductById,
  createNewProduct,
  updateProductById,
  deleteProductByID,
};
