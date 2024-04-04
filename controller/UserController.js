import { User } from "../models/UserModel.js";
import expressAsyncHandler from "express-async-handler";

const registerUser = expressAsyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }
  const user = await User.create({
    firstname,
    lastname,
    email,
    mobile,
    password,
  });
  res.status(201).json(user);
});
export default registerUser;
