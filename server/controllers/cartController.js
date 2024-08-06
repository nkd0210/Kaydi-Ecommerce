import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not allowed to add this product to cart" });
  }
  try {
    //find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // if no cart exits, create a new one
      cart = new Cart({ userId, products: [] });
    }

    //find the product to get the price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex !== -1) {
      // if product exists, increase the quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // if product does not exist, add it to the cart
      cart.products.push({ productId, quantity, price: product.price });
    }
    // update the subtotal
    cart.subtotal = cart.products.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  const { userId, productId } = req.body;
  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Update the subtotal
    cart.subtotal = cart.products.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // Save the updated cart
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const getUserCart = async (req, res, next) => {
  const { userId } = req.body;

  if (req.user.id !== userId) {
    return res
      .status(401)
      .json({ message: "You are not allowed to view this" });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const uniqueProductCount = cart.products.length;

    const totalProducts = cart.products.reduce(
      (total, item) => total + item.quantity,
      0
    );

    res.status(200).json({
      totalProducts,
      uniqueProductCount,
      cart,
    });
  } catch (error) {
    next(error);
  }
};
