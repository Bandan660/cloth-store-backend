import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import authRoutes from "./routes/AuthRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import { errorHandler, notFound } from "./middleware/ErrorHandling.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();
connectDB();


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// All api routes
app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
