import expressAsyncHandler from "express-async-handler";
import { Order } from "../models/OrderModel.js";
import { Cart } from "../models/CartModel.js";
import { razorpay } from "../config/RazorpayClient.js";
import crypto from "crypto";

// create order
const createRazorpayOrder = expressAsyncHandler(async (req, res) => {
  const { amount, currency, receipt, notes, userId, shippingInfo, cartItems } =
    req.body;

  if (
    !amount ||
    !currency ||
    !receipt ||
    !notes ||
    !userId ||
    !shippingInfo ||
    !cartItems
  ) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: receipt,
    notes: notes,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res
        .status(400)
        .json({ message: "Razorpay order creation failed" });
    }

    const newOrder = await Order.create({
      shippingInfo,
      user: userId,
      subtotal: amount,
      total: amount,
      paymentStatus: "Pending",
      cartItems,
      razorpayOrderId: razorpayOrder.id,
    });
    res.status(200).json({
      message: "Razorpay order created successfully",
      order: newOrder,
      
    });
  } catch (error) {
    throw new Error(error);
  }
});

// verify payment
const verifyPayment = expressAsyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
    


  if (expectedSignature === razorpaySignature) {
    try {
      const updatedOrder = await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpayOrderId,
        },
        {
          razorpayPaymentId: razorpayPaymentId,
          razorpaySignature: razorpaySignature,
          paymentStatus: "Paid",
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res
          .status(400)
          .json({ message: "Payment verification failed", updatedOrder });
      }

      res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res.status(400).json({ message: "Invalid payment signature" });
    console.log("expect", expectedSignature);
    console.log("actual", razorpaySignature);
  }
});

// fetch all order
const AllOrder = expressAsyncHandler(async (req, res) => {
  try {
    const order = await Order.find().sort({ status: 1, updatedAt: -1 }).exec();
    if (!order) {
      return res.status(400).json({ message: "No Orders" });
    }
    res.json({ message: "All Orders", order });
  } catch (error) {
    throw new Error(error);
  }
});

const orderbyUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.find({ user: id })
      .sort({ status: 1, updatedAt: -1 })
      .exec();
    if (!order) {
      return res.status(400).json({ message: "No Orders" });
    }
    res.json({ message: "All Orders", order });
  } catch (error) {
    throw new Error(error);
  }
});
const orderDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "No Orders" });
    }
    res.json({ message: " Orders details", order });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderstatus = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(400).json({ message: "No Orders" });
    }
    res.json({ message: "All Orders", order });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePaymentStatus = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
      return res.status(400).json({ error: "Invalid payment status value" });
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    return res.json({ message: "Payment status updated successfully", order });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
const cancelOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, { new: true });
    if (!order) {
      return res.status(400).json({ message: "No Orders" });
    }
    order.status = "Cancelled";
    await order.save();
    return res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    throw new Error(error);
  }
});
const returnOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, { new: true });
    if (!order) {
      return res.status(400).json({ message: "No Orders" });
    }
    order.status = "Returned";
    await order.save();
    return res.json({ message: "Order returned successfully", order });
  } catch (error) {
    throw new Error(error);
  }
});

export {
  createRazorpayOrder,
  verifyPayment,
  AllOrder,
  orderbyUser,
  orderDetails,
  updateOrderstatus,
  updatePaymentStatus,
  cancelOrder,
  returnOrder,
};
