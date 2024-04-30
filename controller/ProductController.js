import { Product } from "../models/ProductModel.js";
import { User } from "../models/UserModel.js";
import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
});
// upload image

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
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
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
    // Check if files were uploaded successfully
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Make sure all files are images
    const files = req.files;

    // Upload thumbnail image to Cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(files[0].path);
    const thumbnailUrl = thumbnailResult.secure_url;

    // Upload additional images to Cloudinary
    const additionalImageUrls = [];
    for (let i = 1; i < files.length; i++) {
      const result = await cloudinary.uploader.upload(files[i].path);
      additionalImageUrls.push(result.secure_url);
    }

    // Create the product with the Cloudinary image URLs
    const product = await Product.create({
      ...req.body,
      thumbnail: thumbnailUrl,
      images: additionalImageUrls,
    });

    res.json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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

// add to wishlist
const addToWishlist = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.user;
    const { productId } = req.body;

    // check is user login or not
    const user = await User.findById(id);
    const alreadyAdded = await user.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        id,
        { $pull: { wishlist: productId } },
        { new: true }
      );
      res.json({ message: "Product removed from wishlist", user });
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        { $push: { wishlist: productId } },
        { new: true }
      );
      res.json({ message: "Product added to wishlist", user });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// get wishlist item

// product rating
const rating = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, productId, comment, subject } = req.body;
  try {
    const product = await Product.findById(productId);

    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === id.toString()
    );
    if (!alreadyRated) {
      let updateRating = await Product.findByIdAndUpdate(
        productId,
        {
          $push: { ratings: { star, postedby: id, comment, subject } },
        },
        { new: true }
      ).populate("ratings.postedby");
      res.json({ message: "Thanks for rating", updateRating });
    } else {
      const updateRating = await Product.updateOne(
        { _id: productId, "ratings.postedby": id },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
            "ratings.$.subject": subject,
          },
        }
      );
      res.json({
        message: "Your already given rating for this product",
        updateRating,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// for uploading images

export {
  getAllProducts,
  getSingleProductById,
  createNewProduct,
  updateProductById,
  deleteProductByID,
  addToWishlist,
  rating,
};
