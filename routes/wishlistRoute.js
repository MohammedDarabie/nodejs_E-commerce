const express = require("express");
const {
  addProductToWishList,
  removeProductToWishList,
  getLoggedUserWishList,
} = require("../services/wishlistService");
// const {} = require("../utils/Validators/BrandValidators");
const authService = require("../services/authService");
//
const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addProductToWishList).get(getLoggedUserWishList);
router.route("/:productId").delete(removeProductToWishList);

module.exports = router;
