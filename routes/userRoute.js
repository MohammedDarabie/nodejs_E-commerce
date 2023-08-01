const express = require("express");

const {
  createUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
} = require("../utils/Validators/usersValidators");
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
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getSpecificUserValidator, getSpecificUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put(
  "/changepassword/:id",
  updateUserPasswordValidator,
  updateUserPassword
);

module.exports = router;
