const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");
//

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product Name must be provided")
    .isLength({ min: 3 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too long category Name"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.getSpecificBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];
