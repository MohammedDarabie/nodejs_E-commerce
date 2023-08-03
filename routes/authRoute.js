const express = require("express");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/Validators/AuthValidator");
const {
  signUp,
  logIn,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/login", loginValidator, logIn);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyPassword", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
