const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressesService");
// const {} = require("../utils/Validators/BrandValidators");
const authService = require("../services/authService");
//
const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);
router.route("/:addressesId").delete(removeAddress);

module.exports = router;
