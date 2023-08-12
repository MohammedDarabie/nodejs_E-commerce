const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  findSpecificOrder,
  filterOrdersforLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkOutSession,
} = require("../services/orderService");
const authService = require("../services/authService");
//
const router = express.Router();
router.use(authService.protect);

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkOutSession
);

router.route("/:cartId").post(createCashOrder);
router.get(
  "/",
  authService.allowedTo("user", "admin", "seller"),
  filterOrdersforLoggedUser,
  getAllOrders
);
router.get("/:id", findSpecificOrder);

router.put(
  "/:id/pay",
  authService.allowedTo("admin", "seller"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "seller"),
  updateOrderToDelivered
);

module.exports = router;
