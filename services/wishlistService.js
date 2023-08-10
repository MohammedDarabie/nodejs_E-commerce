const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

/* ---------------------------- @ desc Add product to wishList --------------------------- */
/* ---------------------------- @ Route POST /api/v1/wishList --------------------------- */
/* ---------------------------- @ Access Protected/User  --------------------------- */
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Product added successfully to wishList",
    data: user.wishlist,
  });
});
/* ---------------------------- @ desc remove product to wishList --------------------------- */
/* ---------------------------- @ Route Delete /api/v1/wishList/:ProductID --------------------------- */
/* ---------------------------- @ Access Protected/User  --------------------------- */
exports.removeProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Product removed successfully to wishList",
    data: user.wishlist,
  });
});
/* ---------------------------- @ desc Get Logged User wishList --------------------------- */
/* ---------------------------- @ Route GET /api/v1/wishList --------------------------- */
/* ---------------------------- @ Access Protected/User  --------------------------- */
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const userWishList = await UserModel.findById(req.user._id).populate(
    "wishlist"
  );
  res.status(200).json({
    resultLength: userWishList.addresses.length,
    userWishList,
  });
});
