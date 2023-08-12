const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const cartModel = require("../models/cartModel");
const couponModel = require("../models/couponModel");
const productModel = require("../models/productModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};
/* ----------------------------- @ desc Add product to Cart ---------------------------- */
/* ----------------------------- @ Route POST /api/v1/cart ---------------------------- */
/* ----------------------------- @ Access Private ---------------------------- */

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await productModel.findById(productId);
  // 1) Get Cart for logged User
  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  //   Calc Total Cart Price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Product added to Cart Successfully",
    data: cart,
  });
});

/* ----------------------------- @ desc Get Logged User Cart ---------------------------- */
/* ----------------------------- @ Route Get /api/v1/cart ---------------------------- */
/* ----------------------------- @ Access Private ---------------------------- */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const userCart = await cartModel.findOne({ user: req.user._id });
  if (!userCart) {
    return next(
      new ApiError(`There is no Cart Fro Logged User ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "Success",
    cartLength: userCart.cartItems.length,
    userCart,
  });
});

/* ----------------------------- @ desc Remove Item from Cart ---------------------------- */
/* ----------------------------- @ Route delete /api/v1/cart/:itemId ---------------------------- */
/* ----------------------------- @ Access Private ---------------------------- */
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Success",
    cartLength: cart.cartItems.length,
    cart,
  });
});

/* ----------------------------- @ desc Clear Item from Cart ---------------------------- */
/* ----------------------------- @ Route Delete /api/v1/cart ---------------------------- */
/* ----------------------------- @ Access Private ---------------------------- */
exports.clearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });

  res.status(204).json({
    message: "Successfully Deleted",
  });
});

/* ----------------------------- @ desc update specific Cart Item Quantity ---------------------------- */
/* ----------------------------- @ Route Delete /api/v1/cart ---------------------------- */
/* ----------------------------- @ Access Private ---------------------------- */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`There is no cart user for ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is no item for this id : ${req.params.itemId}`, 404)
    );
  }
  calcTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "Success",
    cartLength: cart.cartItems.length,
    cart,
  });
});

/* ----------------------------- @ desc Apply Coupon on Cart ---------------------------- */
/* ----------------------------- @ Route Delete /api/v1/applyCoupon ---------------------------- */
/* ----------------------------- @ Access Private ---------------------------- */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("Coupon is invalid", 400));
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;

  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    status: "Success",
    cartLength: cart.cartItems.length,
    cart,
  });
});
