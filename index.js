import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import authRoutes from "./routes/AuthRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import BrandRoutes from "./routes/BrandRoutes.js";
import AddressRoutes from "./routes/AddressRoutes.js";
import CartRoutes from "./routes/CartRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
// import PaymentRoutes from "./routes/PaymentRoutes.js";
import { errorHandler, notFound } from "./middleware/ErrorHandling.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();
connectDB();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to backend ");
});

// All api routes
app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", BrandRoutes);
app.use("/api/address", AddressRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/order", OrderRoutes);
// app.use("/api/payments/", PaymentRoutes)

// middleware
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
