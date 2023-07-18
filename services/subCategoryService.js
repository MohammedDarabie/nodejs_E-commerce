const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");
//

// Middleware to set category to body from params
exports.setCategoryIdtoBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
/* --------------------------- @ desc Create SubCategory --------------------------- */
/* --------------------------- @ Route POST /api/v1/subcategories --------------------------- */
/* --------------------------- @ Access Public --------------------------- */
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const createdSubCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  if (createdSubCategory) {
    return res.json({
      status: req.status,
      data: createdSubCategory,
    });
  }
  next(new ApiError("Couldn't create Subcategory", 400));
});

exports.getSubCategories = asyncHandler(async (req, res, next) => {
  /* --------------------------- @ desc Get SubCategories --------------------------- */
  /* --------------------------- @ Route GET /api/v1/subcategories --------------------------- */
  /* --------------------------- @ Access Public --------------------------- */
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  const subcategory = await SubCategoryModel.find(req.filterObj)
    .skip(skip)
    .limit(limit);

  if (!subcategory) {
    return next(new ApiError("Couldn't find ", 400));
  }
  return res.json({
    status: res.status,
    page,
    dataLength: subcategory.length,
    data: subcategory,
  });
});

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  /* --------------------------- @ desc Get Specific SubCategories --------------------------- */
  /* --------------------------- @ Route GET /api/v1/subcategories/:id --------------------------- */
  /* --------------------------- @ Access Public --------------------------- */
  const { id } = req.params;
  const subcategory = await SubCategoryModel.findById(id);

  if (!subcategory) {
    return next(new ApiError("Couldn't find ", 404));
  }

  return res.json({
    status: res.status,
    data: subcategory,
  });
});
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  /* --------------------------- @ desc Update SubCategory --------------------------- */
  /* --------------------------- @ Route Put /api/v1/subcategories/:id --------------------------- */
  /* --------------------------- @ Access Private --------------------------- */
  const { id } = req.params;
  const { name, category } = req.body;
  const updatedSubcategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!updatedSubcategory) {
    return next(new ApiError("Could not Find Sub-Category Id", 400));
  }

  return res.json({
    status: res.status,
    data: updatedSubcategory,
  });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  /* --------------------------- @ desc Delete SubCategory --------------------------- */
  /* --------------------------- @ Route delete /api/v1/subcategories/:id --------------------------- */
  /* --------------------------- @ Access Private --------------------------- */
  const { id } = req.params;
  const deletedsubcategory = await SubCategoryModel.findOneAndDelete(id);
  if (!deletedsubcategory) {
    return next(new ApiError("Didn't find Id", 400));
  }

  return res.json({
    status: res.status,
    message: "Successfully Deleted",
  });
});
