import { Product } from "../models/ProductModel.js";
import { User } from "../models/UserModel.js";
import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

import cloudinary from "cloudinary";
import multer from "multer";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error("Cloudinary environment variables are not set");
}// Multer configuration



// get all products
const getAllProducts = expressAsyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const field = req.query.fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("Page does not exist");
    }

    const products = await query;
    res.json({ message: "All products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get single product by id
const getSingleProductById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// create the product
const createNewProduct = [
 // Multer middleware to handle file uploads, allowing up to 10 files
  expressAsyncHandler(async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const files = req.files;

      // Upload thumbnail image to Cloudinary
      const thumbnailResult = await cloudinary.uploader.upload(files[0].path);
      const thumbnailUrl = thumbnailResult.secure_url;

      // Upload additional images to Cloudinary
      const uploadPromises = files.slice(1).map(file => cloudinary.uploader.upload(file.path));
      const additionalResults = await Promise.all(uploadPromises);
      const additionalImageUrls = additionalResults.map(result => result.secure_url);

      // Extract colors and sizes from request body
      const { color, size, ...otherFields } = req.body;

      // Create the product with the Cloudinary image URLs and colors
      const product = await Product.create({
        ...otherFields,
        thumbnail: thumbnailUrl,
        images: additionalImageUrls,
        color: color.split(',').map(color => color.trim()), // Convert comma-separated string to array of colors
        size: size.split(',').map(size => size.trim()), // Convert comma-separated string to array of sizes
      });

      // Clean up local files after upload
      const cleanupPromises = files.map(file => fs.promises.unlink(file.path));
      await Promise.all(cleanupPromises);

      res.json({ message: "Product created successfully", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  })
];




// update the product by id
const updateProductById = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete the product by id
const deleteProductByID = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add to wishlist
const addToWishlist = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.user;
    const { productId } = req.body;

    const user = await User.findById(id);
    const alreadyAdded = user.wishlist.find(id => id.toString() === productId);

    if (alreadyAdded) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { wishlist: productId } },
        { new: true }
      );
      res.json({ message: "Product removed from wishlist", user: updatedUser });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $push: { wishlist: productId } },
        { new: true }
      );
      res.json({ message: "Product added to wishlist", user: updatedUser });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// product rating
const rating = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, productId, comment, subject } = req.body;

  try {
    const product = await Product.findById(productId);
    const alreadyRated = product.ratings.find(rating => rating.postedby.toString() === id.toString());

    if (!alreadyRated) {
      const updatedRating = await Product.findByIdAndUpdate(
        productId,
        { $push: { ratings: { star, postedby: id, comment, subject } } },
        { new: true }
      ).populate("ratings.postedby");
      res.json({ message: "Thanks for rating", product: updatedRating });
    } else {
      const updatedRating = await Product.updateOne(
        { _id: productId, "ratings.postedby": id },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.subject": subject } }
      );
      res.json({ message: "Your rating has been updated", product: updatedRating });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  getAllProducts,
  getSingleProductById,
  createNewProduct,
  updateProductById,
  deleteProductByID,
  addToWishlist,
  rating,
};
