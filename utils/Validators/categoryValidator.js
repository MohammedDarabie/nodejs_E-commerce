const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");

//
//
//
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];

/* ------------------------ Create Category Validator ----------------------- */
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Required")
    .isLength({ min: 3 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too long category Name"),
  validatorMiddleware,
];

/* ------------------------ Update Category Validator ----------------------- */
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  check("name").notEmpty().withMessage('Should not be Empty').isLength({ min: 3 })
  .withMessage("Too Short Category Name")
  .isLength({ max: 32 })
  .withMessage("Too long category Name"),
  validatorMiddleware,
];

/* ------------------------ Delete Category Validator ----------------------- */
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
];
