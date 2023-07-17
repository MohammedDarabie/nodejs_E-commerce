const express = require("express");
const {
  getCategories,
  createCategory,
  deleteAllCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../services/categoryService");
const router = express.Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/Validators/categoryValidator");
/* --------------------------------- Routes --------------------------------- */
router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .delete(deleteCategoryValidator, deleteCategory)
  .put(updateCategoryValidator, updateCategory);
module.exports = router;
