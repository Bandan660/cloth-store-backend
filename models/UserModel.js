import mongoose from "mongoose";

// Declare the Schema for the user model
var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  address: {
    type: String,
  },
  wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  refreshToken: {
    type: String,
  },

  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

//Export the model
export const User = mongoose.models.User || mongoose.model("User", userSchema);
