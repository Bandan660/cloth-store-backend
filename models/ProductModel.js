import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
    },
    color: {
      type: [String],
    },
    size: {
      type: [String],
    },
    ratings: [
      {
        star: Number,
        comment: String,
        subject: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

//Export the model
export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
