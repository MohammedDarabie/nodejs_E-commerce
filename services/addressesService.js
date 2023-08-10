const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

/* ---------------------------- @ desc Add Address to User Adresses list --------------------------- */
/* ---------------------------- @ Route POST /api/v1/addresses --------------------------- */
/* ---------------------------- @ Access Protected/User  --------------------------- */
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Address added successfully",
    data: user.addresses,
  });
});
/* ---------------------------- @ desc remove Address --------------------------- */
/* ---------------------------- @ Route Delete /api/v1/addresses/:addressesId --------------------------- */
/* ---------------------------- @ Access Protected/User  --------------------------- */
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressesId } },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Address removed successfully",
    data: user.addresses,
  });
});
/* ---------------------------- @ desc Get Logged User addresses --------------------------- */
/* ---------------------------- @ Route GET /api/v1/addresses --------------------------- */
/* ---------------------------- @ Access Protected/User  --------------------------- */
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("addresses");
  res.status(200).json({
    resultLength: user.addresses.length,
    addresses: user.addresses,
  });
});
