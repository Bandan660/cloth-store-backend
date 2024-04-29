import expressAsyncHandler from "express-async-handler";
import { Order } from "../models/OrderModel.js";
import { Cart } from "../models/CartModel.js";

const createOrder = expressAsyncHandler(async (req, res) => {
  
  try {
    const newOrder = await Order.create(req.body);

    res.status(200).json(newOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const checkout=expressAsyncHandler(async(req,res)=>{
  const {}=req.body;

})

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
  createOrder,
  AllOrder,
  orderbyUser,
  orderDetails,
  updateOrderstatus,
  updatePaymentStatus,
  cancelOrder,
  returnOrder,
};
