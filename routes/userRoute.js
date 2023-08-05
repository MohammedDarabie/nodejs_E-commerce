const express = require("express");

const {
  createUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserValidator,
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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require("../services/userService");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getSpecificUser);
router.delete("/deleteMe", deleteLoggedUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);

/* ---------------------------------- Admin --------------------------------- */
router.use(authService.allowedTo("admin", "seller"));

router.put(
  "/changepassword/:id",
  updateUserPasswordValidator,
  updateUserPassword
);
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getSpecificUserValidator, getSpecificUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
