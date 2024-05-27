import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  size: { type: String, required: false },
  color: { type: String, required: false },
  image: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },

    cartItems: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", schema);
