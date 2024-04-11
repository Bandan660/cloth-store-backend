import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],

    paymentIntent: {
      type: String,
      default: "Not paid",
    },
    orderStatus: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Cash on Delivery",
        "processing",
        "Dispatched",
        "Cancelled",
        "Completed",
      ],
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt values automatically
  }
);

//Export the model
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
