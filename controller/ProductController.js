import { Product } from "../models/ProductModel.js";
import expressAsyncHandler from "express-async-handler";

// get all products
const getAllProducts = expressAsyncHandler(async (req, res) => {
  try {
    // filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));
    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // how to limiting the field
    if (req.query.fields) {
      const field = req.query.fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skipFrom = (page - 1) * limit;
    query = query.skip(skipFrom).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skipFrom >= productCount) {
        throw new Error("Page does not exist");
      }
    }
    console.log(page, limit, skipFrom);

    const product = await query;
    res.json({ message: "All products fetched successfully", product });
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
