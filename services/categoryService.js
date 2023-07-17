const { default: slugify } = require("slugify");
const CategoryModel = require("./../models/categoryModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
exports.getCategories = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Get List Categories --------------------------- */
  /* ---------------------------- @ Route GET /api/v1/categories --------------------------- */
  /* ---------------------------- @ Access Public  --------------------------- */
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const allCategories = await CategoryModel.find().skip(skip).limit(limit);
  res.send({
    status: 200,
    page,
    Length: allCategories.length,
    data: allCategories,
  });
});
exports.createCategory = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Create Categories --------------------------- */
  /* ---------------------------- @ Route POST /api/v1/categories --------------------------- */
  /* ---------------------------- @ Access Private --------------------------- */
  const name = req.body.name;
  const createdCategory = await CategoryModel.create({
    name,
    slug: slugify(name),
  });
  res.send({
    status: res.status,
    data: createdCategory,
  });
});



exports.getCategory = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Get Specifc Categories --------------------------- */
  /* ---------------------------- @ Route GET /api/v1/categories/:id --------------------------- */
  /* ---------------------------- @ Access Public --------------------------- */
  const id = req.params.id;
  const category = await CategoryModel.findById(id);
  if (!category) {
    // res.status(404).json({
    //   messsage: "Category not Found",
    // });
    return next(new ApiError(`Category not Found : ${id}`, 404));
  }
  res.json({
    status: 200,
    data: category,
  });
});

// 64b3ffeb51eb25348073ccde

exports.updateCategory = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Update Specific Category --------------------------- */
  /* ---------------------------- @ Route Patch /api/v1/categories/:id --------------------------- */
  /* ---------------------------- @ Access Private --------------------------- */
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`Category not Found : ${id}`, 404));
  }
  res.status(200).json({
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res,next) => {
  /* ---------------------------- @ desc Delete Specific Category --------------------------- */
  /* ---------------------------- @ Route delete /api/v1/categories/:id --------------------------- */
  /* ---------------------------- @ Access Private --------------------------- */
  const id = req.params.id;
  const category = await CategoryModel.deleteOne({ _id: id });
  if (!category) {
    return next(new ApiError(`Category not Found : ${id}`, 404));
  }
  res.json({
    status: 204,
    message: "Successfully Deleted",
  });
});
