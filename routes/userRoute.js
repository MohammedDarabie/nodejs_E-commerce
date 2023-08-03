const express = require("express");

const {
  createUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
} = require("../utils/Validators/usersValidators");
const authService = require("../services/authService");
//
const {
  createUser,
  getUsers,
  updateUser,
  getSpecificUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  updateUserPassword,
} = require("../services/userService");

const router = express.Router();

router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin"), getUsers)
  .post(authService.protect, authService.allowedTo("admin"),uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(authService.protect, authService.allowedTo("admin"),getSpecificUserValidator, getSpecificUser)
  .put(authService.protect, authService.allowedTo("admin"),uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(authService.protect, authService.allowedTo("admin"),deleteUserValidator, deleteUser);

router.put(
  "/changepassword/:id",
  updateUserPasswordValidator,
  updateUserPassword
);

module.exports = router;
