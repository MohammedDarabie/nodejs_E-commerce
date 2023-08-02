const express = require("express");
const {
  getCategories,
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
//
const router = express.Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/Validators/categoryValidator");
const authService = require("../services/authService");

const subCategoryRoute = require("./subCategoryRoute");

/* --------------------------------- Routes --------------------------------- */

/* -------------------------------- SubRoutes ------------------------------- */

router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("seller", "admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .delete(deleteCategoryValidator, deleteCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  );

module.exports = router;
