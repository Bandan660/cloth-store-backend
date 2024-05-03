import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
         
        },
        color: String,
        size: String,
        price: Number,
      },
    ],
    cartTotal: {
      type: Number,
      default: 0,
    },
    totalAfterDiscount: Number,
    discounts: [
      {
        code: String,
        amount: Number,
      },
    ],
    orderby: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
