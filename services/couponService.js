const factory = require("./handlerFactory");
const couponModel = require('../models/couponModel')
/* ---------------------------- @ desc Get All coupon --------------------------- */
/* ---------------------------- @ Route Get /api/v1/coupons --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.getCoupons = factory.getAll(couponModel);
/* ---------------------------- @ desc Get Specific coupon --------------------------- */
/* ---------------------------- @ Route get /api/v1/coupons/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.getSpecificCoupon = factory.getOne(couponModel);
/* ---------------------------- @ desc Create coupon --------------------------- */
/* ---------------------------- @ Route Post /api/v1/coupons --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.createCoupon= factory.createOne(couponModel);
//   /* ---------------------------- @ desc Update coupon --------------------------- */
//   /* ---------------------------- @ Route PUT /api/v1/coupons/:id --------------------------- */
//   /* ---------------------------- @ Access Private  --------------------------- */
exports.updateCoupon = factory.updateOne(couponModel);
/* ---------------------------- @ desc Delete coupon --------------------------- */
/* ---------------------------- @ Route delete /api/v1/coupons/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.deleteCoupon = factory.deleteOne(couponModel);
