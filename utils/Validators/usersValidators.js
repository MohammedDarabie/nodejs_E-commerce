const { check, body } = require("express-validator");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");
const UserModel = require("../../models/userModel");
//

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product Name must be provided")
    .isLength({ min: 3 })
    .withMessage("Too Short Category Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already Exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 6 })
    .withMessage("Too Short Password")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation is incorrect");
      }
      return true;
    }),
  check("passwordConfirm").notEmpty().withMessage("Password confirm required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG"])
    .withMessage("Invalid Phone Number (EG-SA)"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.getSpecificUserValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already Exists"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG"])
    .withMessage("Invalid Phone Number (EG-SA)"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];

exports.updateUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage(" Current password is Required"),
  check("passwordConfirm").notEmpty().withMessage(" Password Confirm Required"),
  check("password")
    .notEmpty()
    .withMessage(" Password Required")
    .custom(async (password, { req }) => {
      // Verify current password
      const doc = await UserModel.findById(req.params.id);
      if (!doc) {
        throw new Error("User not Found");
      }

      //
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        doc.password
      );

      if (!isCorrectPassword) {
        throw new Error("Incorrect Current Password");
      }
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation is incorrect");
      }
      const pass = await bcrypt.compare(password, doc.password);
      if (pass) {
        throw new Error("Must Choose a new Password");
      }
      return true;
    }),
  validatorMiddleware,
];



exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already Exists"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG"])
    .withMessage("Invalid Phone Number (EG-SA)"),
  validatorMiddleware,
];