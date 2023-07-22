const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");
//
//
// Middleware to set category to body from params
// Nested Route (Create)
exports.setCategoryIdtoBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// Nested Route (GET)
//  /api/v1/categories/:categoryId/subcategories
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
/* --------------------------- @ desc Get SubCategories --------------------------- */
/* --------------------------- @ Route GET /api/v1/subcategories --------------------------- */
/* --------------------------- @ Access Public --------------------------- */
exports.getSubCategories = factory.getAll(SubCategoryModel);
/* --------------------------- @ desc Get Specific SubCategories --------------------------- */
/* --------------------------- @ Route GET /api/v1/subcategories/:id --------------------------- */
/* --------------------------- @ Access Public --------------------------- */
exports.getSubCategory = factory.getOne(SubCategoryModel);
/* --------------------------- @ desc Create SubCategory --------------------------- */
/* --------------------------- @ Route POST /api/v1/subcategories --------------------------- */
/* --------------------------- @ Access Public --------------------------- */
exports.createSubCategory = factory.createOne(SubCategoryModel);
/* --------------------------- @ desc Update SubCategory --------------------------- */
/* --------------------------- @ Route Put /api/v1/subcategories/:id --------------------------- */
/* --------------------------- @ Access Private --------------------------- */
exports.updateSubCategory = factory.updateOne(SubCategoryModel);
/* --------------------------- @ desc Delete SubCategory --------------------------- */
/* --------------------------- @ Route delete /api/v1/subcategories/:id --------------------------- */
/* --------------------------- @ Access Private --------------------------- */
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
