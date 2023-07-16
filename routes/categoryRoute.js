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
/* --------------------------------- Routes --------------------------------- */
router
  .route("/")
  .get(getCategories)
  .post(createCategory)
  .delete(deleteAllCategory);

router
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .put(updateCategory);
module.exports = router;
