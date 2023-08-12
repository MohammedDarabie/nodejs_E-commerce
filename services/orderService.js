// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apiError");

const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

exports.filterOrdersforLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

/* ---------------------------- @ desc Create Cash Order --------------------------- */
/* ---------------------------- @ Route POST /api/v1/orders/:cartId --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // App Setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) get cart depending on cartID
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is no cart with this id", 404));
  }
  // 2) Get order price depending on cart price "Check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method
  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) After creating Order Decrement Quantity of product and increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    // 5) Clear User Cart depending on Cart Id
    await cartModel.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: "Success",
    data: order,
  });
});

/* ---------------------------- @ desc Get All Order --------------------------- */
/* ---------------------------- @ Route Get /api/v1/orders --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.getAllOrders = factory.getAll(orderModel);

/* ---------------------------- @ desc Get Specific Order --------------------------- */
/* ---------------------------- @ Route GET /api/v1/orders --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.findSpecificOrder = factory.getOne(orderModel);

/* ---------------------------- @ desc Update Order paid --------------------------- */
/* ---------------------------- @ Route PUT /api/v1/orders/:id/pay --------------------------- */
/* ---------------------------- @ Access Admin-Seller  --------------------------- */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with user ${req.params.id}`, 404)
    );
  }

  order.paidAt = Date.now();
  order.isPaid = true;

  const updatedOrder = await order.save();

  res.status(200).json({
    message: "Success",
    updatedOrder,
  });
});
/* ---------------------------- @ desc Update Order Delivered --------------------------- */
/* ---------------------------- @ Route PUT /api/v1/orders/:id/deliver --------------------------- */
/* ---------------------------- @ Access Admin-Seller  --------------------------- */
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with user ${req.params.id}`, 404)
    );
  }

  order.deliveredAt = Date.now();
  order.isDelivered = true;

  const updatedOrder = await order.save();

  res.status(200).json({
    message: "Success",
    updatedOrder,
  });
});

/* ---------------------------- @ desc Get Checkout Session From Stripe and send it as response --------------------------- */
/* ---------------------------- @ Route GET /api/v1/orders/checkout-session/:cartId --------------------------- */
/* ---------------------------- @ Access User  --------------------------- */
// STRIPE CONFIG
exports.checkOutSession = asyncHandler(async (req, res, next) => {
  // App Setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) get cart depending on cartID
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("There is no cart with this id", 404));
  }
  // 2) Get order price depending on cart price "Check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "sar",
          unit_amount: totalOrderPrice * 100,
          product_data: { name: req.user.name },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // Send Session to response
  res.status(200).json({
    status: "Success",
    session,
  });
});
