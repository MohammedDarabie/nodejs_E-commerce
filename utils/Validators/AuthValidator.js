const {check} = require("express-validator"); 
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");
const UserModel = require("../../models/userModel");
//

exports.signUpValidator = [
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

  validatorMiddleware,
];



exports.loginValidator = [
  check('email').notEmpty().withMessage("Email is required").isEmail()
  .withMessage("Invalid Email Address"),
  check("password").notEmpty().withMessage("Password is required").isLength({ min: 6 })
  .withMessage("Too Short Password") ,
  validatorMiddleware
]