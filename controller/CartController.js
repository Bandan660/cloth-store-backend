import expressAsyncHandler from "express-async-handler";
import { Cart } from "../models/CartModel.js";
import { Product } from "../models/ProductModel.js";

// Add product to cart
const addToCart = expressAsyncHandler(async (req, res) => {
  const { productId, quantity, color, size,price } = req.body;
  const { _id } = req.user; // Assuming you have user information in the request

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create or update cart
    let cart = await Cart.findOne({ orderby: _id });

    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = new Cart({
        products: [{ product: productId, quantity, color, size ,price}],
        orderby: _id,
        
      });
    } else {
      // Update existing cart
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // If product already exists in cart, update its quantity and color
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // If product doesn't exist in cart, add it to the cart
        cart.products.push({ product: productId, quantity, color, size });
      }

     
    }

    // Save the cart
    await cart.save();

    res
      .status(201)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add product to cart", error: error.message });
  }
});

// Get cart details
const getCartDetails = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you have user information in the request

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ orderby: userId }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart details", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get cart details", error: error.message });
  }
});

// Remove product from cart
const removeFromCart = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const userId = req.user._id;
    // Find the cart for the user
    const cart = await Cart.findOne({ orderby: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product to be removed
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === id
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Product removed from cart successfully", cart });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product from cart",
      error: error.message,
    });
  }
});

// Export controllers
export { addToCart, getCartDetails, removeFromCart };
