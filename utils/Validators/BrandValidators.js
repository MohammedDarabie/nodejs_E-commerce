const { check } = require("express-validator");
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
  validatorMiddleware,
];

exports.getSpecificBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  check("name")
    .notEmpty()
    .withMessage("Should not be Empty")
    .isLength({ min: 3 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too long category Name"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];
