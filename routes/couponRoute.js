const express = require("express");
const {
  getCoupons,
  getSpecificCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const authService = require("../services/authService");
//
const router = express.Router();

router.use(authService.protect, authService.allowedTo("seller", "admin"));
router.route("/").get(getCoupons).post(createCoupon);

router
  .route("/:id")
  .get(getSpecificCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
