const express = require("express");
const {
  signUpValidator,
  loginValidator,
} = require("../utils/Validators/AuthValidator");
const { signUp, logIn } = require("../services/authService");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/login").post(loginValidator, logIn);

// router
//   .route("/:id")
//   .get(getSpecificUserValidator, getSpecificUser)
//   .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
 