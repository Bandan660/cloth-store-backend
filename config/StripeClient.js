import Stripe from "stripe";
const stripekey = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(stripekey);
