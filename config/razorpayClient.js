import Razorpay from "razorpay";

export const instance = new Razorpay({
  key_id: process.env.API_key,
  key_secret: process.env.API_secret,
});
