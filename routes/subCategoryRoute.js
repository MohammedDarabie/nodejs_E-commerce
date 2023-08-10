const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdtoBody,
  createFilterObject,
} = require("../services/subCategoryService");
const authService = require("../services/authService");
//
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/Validators/subCategoryValidator");

//
/* --------------------------- End Require section -------------------------- */
//
/* -------------- Merge Params to Access Params on Other Routes ------------- */
const router = express.Router({ mergeParams: true });

// SubRoutes --------------------------------

/* --------------------------------- Routes --------------------------------- */
router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("seller", "admin"),
    setCategoryIdtoBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("seller", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

// Export the router
module.exports = router;
