// Import necessary models
import { Address } from "../models/AddressModel.js";
import { User } from "../models/UserModel.js";
import expressAsyncHandler from "express-async-handler";

// Create a new address
const createAddress = expressAsyncHandler(async (req, res) => {
  try {
    // Create a new address
    const { Id, ...addressData } = req.body;
    const user = await User.findById(Id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAddress = new Address({
      ...addressData,
      user: Id,
    });
    await newAddress.save();
    res.json({ message: "New Address created successfully", newAddress });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to create address", error: error.message });
  }
});

// Get all addresses
const getAddress = expressAsyncHandler(async (req, res) => {
  try {
    // Find all addresses and populate the user field
    const address = await Address.find().populate("user");
    res.json({ message: "All addresses", address });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to get addresses", error: error.message });
  }
});

// get address by user id

const getAddressByUserId = expressAsyncHandler(async (req, res) => {
  const userId = req.params.Id; // Assuming you're passing the user ID as a parameter

  try {
    // Find addresses that belong to the specified user ID
    const address = await Address.find({ user: userId });

    if (!address) {
      return res
        .status(404)
        .json({ message: "No addresses found for the user" });
    }

    res.json({ message: "Addresses found", address });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to get addresses", error: error.message });
  }
});

// Get address by ID
const getAddressById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the address by ID and populate the user field
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ message: "No address found" });
    }

    res.json({ message: "Address", address });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to get address", error: error.message });
  }
});

// Update an address
const updateAddress = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the address by ID and update it
    const updatedAddress = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedAddress);
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to update address", error: error.message });
  }
});

// Delete an address
const deleteAddress = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the address by ID and delete it
    const deletedAddress = await Address.findByIdAndDelete(id);
    res.json({ message: "Address deleted successfully", deletedAddress });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to delete address", error: error.message });
  }
});

// Export address controller methods
export {
  createAddress,
  getAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAddressByUserId,
};
