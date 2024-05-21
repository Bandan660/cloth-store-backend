import expressAsyncHandler from "express-async-handler";
import { stripe } from "../config/StripeClient.js";

const createPaymentIntent = expressAsyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    res.status(400).json({ message: "Please Enter Your Amount " });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
  res
    .status(201)
    .json({ success: "true", clientSecrete: paymentIntent.client_secret });
});

export default createPaymentIntent;
