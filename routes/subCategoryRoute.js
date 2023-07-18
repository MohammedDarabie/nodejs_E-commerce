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
const {
  createSubCategoryValidator,
  getCategoryValidator,
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
  .post(setCategoryIdtoBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObject, getSubCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

// Export the router
module.exports = router;
