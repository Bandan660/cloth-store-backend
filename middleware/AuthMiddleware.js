import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const AuthMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?._id);
        req.user=user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token expired, Please login again");
    }
  } else {
    throw new Error("there is is no token attached to header");
  }
});
export default AuthMiddleware;
