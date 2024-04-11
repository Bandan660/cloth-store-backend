import { User } from "../models/UserModel.js";
import { Product } from "../models/ProductModel.js";
import {Cart} from "../models/CartModel.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generaterefreshToken } from "../config/refreshToken.js";
import { generateToken } from "../config/jwtToken.js";
import jwt from "jsonwebtoken";

// register the user
const registerUser = expressAsyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }

  try {
    // Encrypt the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating the user
    const user = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    // Sending response with status code and user data
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create user", error: error.message });
  }
});

// login admin

const loginAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email });
    console.log(admin.role);
    if (admin && admin.role !== "admin") throw new Error("You are not a admin");

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const refreshToken = generaterefreshToken(admin._id);
      const updateuser = await User.findByIdAndUpdate(admin._id, {
        refreshToken: refreshToken,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000,
      });
      const token = generateToken(admin._id);

      res.status(200).json({ message: "Login successful", admin, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to login", error: error.message });
  }
});

// login the user

const loginUser = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(password);
    if (user && (await bcrypt.compare(password, user.password))) {
      const refreshToken = generaterefreshToken(user._id);
      const updateuser = await User.findByIdAndUpdate(user._id, {
        refreshToken: refreshToken,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000,
      });
      const token = generateToken(user._id);

      res.status(200).json({ message: "Login successful", user, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to login", error: error.message });
  }
});
// logout the user
const logoutUser = expressAsyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookie");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken: user.refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); // forbidden
});

// update Password
const updatePassword = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.user;
  console.log(password);
  const user = await User.findById(id);
  if (!password) {
    res.status(400).json({ message: "password is required" });
  }
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "password updated successfully" });
  } else {
    res.status(400).json({ message: "user not found" });
  }
});

// handle refresh token
const handleRefreshToken = expressAsyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No refresh token in cookie");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  // Checking if the user exists and the refresh token is valid
  if (!user) {
    throw new Error("User not found");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Invalid refresh token");
    }
    const accessToken = generateToken(user.id);
    res.status(200).json({ accessToken });
  });
});

// get all user
const getAllUser = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});
// get user by id
const getUserById = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    throw new Error(error);
  }
});
// update the user by id

const updateUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    let user = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        mobile: req?.body?.mobile,
        email: req?.body?.email,
      },
      {
        new: true,
      }
    );
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    user = await user.save();

    res.status(200).json({ message: "user updated successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update user", error: error.message });
  }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to delete user", error: error.message });
  }
});

const getWishlist = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).populate("wishlist");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// save the user address
const saveAddress = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.user;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      address: req?.body?.address,
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});
const userCart = expressAsyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  try {
    let product = [];
    const user = await User.findById(_id);
    let alreadyExistCart = await Cart.findOne({ orderby: user._id });

    if (alreadyExistCart) {
      // If cart exists, delete it
      await Cart.deleteOne({ _id: alreadyExistCart._id });
      console.log("Existing cart deleted successfully.");
    }

    // Create a new cart
    alreadyExistCart = new Cart({ orderby: user._id });

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      if (!getPrice) {
        console.error(`Product with ID ${cart[i]._id} not found.`);
        continue;
      }
      object.price = getPrice.price;
      product.push(object);
    }

    // Calculate cartTotal
    let cartTotal = 0;
    for (let i = 0; i < product.length; i++) {
      cartTotal += product[i].price * product[i].count;
    }

    // Update alreadyExistCart with the new products and cartTotal
    alreadyExistCart.products = product;
    alreadyExistCart.cartTotal = cartTotal;

    // Save the updated cart
    await alreadyExistCart.save();

    res.json({ message: "Cart updated successfully", cart: alreadyExistCart });
  } catch (error) {
    console.error("Error processing user cart:", error);
    throw new Error(error);
  }
});

const getUserCart = expressAsyncHandler(async (req, res) => {
  console.log(req.user)
  const { _id } = req.user;
  try {
    const cart = await Cart.findOne({orderby: _id}).populate("products.product")
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndDelete({ orderby:user. _id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

export {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart
};
