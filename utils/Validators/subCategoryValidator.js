const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");

//

/* ------------ SubCategory Validator Before sending to Database ------------ */

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory Required")
    .isLength({ min: 2 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too long category Name"),
  check("category")
    .notEmpty()
    .withMessage("Subcategory Can't be empty")
    .isMongoId()
    .withMessage("Invalid SubCategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

/* --------------------- Validate get Specific Category --------------------- */
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID"),
  validatorMiddleware,
];

/* -------------------- Validate Update Specific Category ------------------- */

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id Should not be Empty ")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  check("name")
    .notEmpty()
    .withMessage("Subcategory updated Name Should not be Empty")
    .isLength({ min: 2 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too long category Name"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

/* ------------------ Validate For Deleting Sub Categories ------------------ */
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];
