const { default: slugify } = require("slugify");
const CategoryModel = require("./../models/categoryModel");
const asyncHandler = require("express-async-handler");
/* ---------------------------- @ desc Get List Categories --------------------------- */
/* ---------------------------- @ Route GET /api/v1/categories --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getCategories = asyncHandler(async (req, res, next) => {
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
/* ---------------------------- @ desc Create Categories --------------------------- */
/* ---------------------------- @ Route POST /api/v1/categories --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.createCategory = asyncHandler(async (req, res, next) => {
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

/* ---------------------------- @ desc Delete All Categories --------------------------- */
/* ---------------------------- @ Route DELETE /api/v1/categories --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.deleteAllCategory = asyncHandler(async (req, res, next) => {
  await CategoryModel.deleteMany();
  res.json({
    message: "Succesfully Deleted",
  });
});

/* ---------------------------- @ desc Get Specifc Categories --------------------------- */
/* ---------------------------- @ Route GET /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Public --------------------------- */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await CategoryModel.findById(id);
  if (!category) {
    res.status(404).json({
      messsage: "Category not Found",
    });
  }
  res.json({
    status: 200,
    data: category,
  });
});

// 64b3ffeb51eb25348073ccde

/* ---------------------------- @ desc Update Specific Category --------------------------- */
/* ---------------------------- @ Route Patch /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    res.status(404).json({
      message: "Category Not Found",
    });
  }
  res.status(200).json({
    data: category,
  });
});

/* ---------------------------- @ desc Delete Specific Category --------------------------- */
/* ---------------------------- @ Route delete /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await CategoryModel.deleteOne({ _id: id });
  if (!category) {
    res.status(404).json({
      message: "Category Not Found",
    });
  }
  res.json({
    status: 204,
    message: "Successfully Deleted",
  });
});
