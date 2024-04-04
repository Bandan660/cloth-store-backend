import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import authRoutes from "./routes/AuthRoutes.js";
import { errorHandler, notFound } from "./middleware/ErrorHandling.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All api routes
app.use("/api/user", authRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
