const asyncHandler = require("express-async-handler");
const { default: slugify } = require("slugify");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
//

exports.getProducts = asyncHandler(async (req, res) => {
  /* ---------------------------- @ desc Get List Product --------------------------- */
  /* ---------------------------- @ Route GET /api/v1/products --------------------------- */
  /* ---------------------------- @ Access Public  --------------------------- */
  /* -------------------------------  Build Query ------------------------------ */
  const documentCounts = await ProductModel.countDocuments()
  const apiFeatures = new APIFeatures(ProductModel.find(), req.query)
    .paginate(documentCounts)
    .filter()
    .search("Product")
    .limit()
    .sort();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;
  return res.json({
    status: res.status,
    results: products.length,
    paginationResult,
    data: products,
  });
});
exports.getProduct = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Get Specific Product --------------------------- */
  /* ---------------------------- @ Route GET /api/v1/products/:id --------------------------- */
  /* ---------------------------- @ Access Public  --------------------------- */
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  if (!product) {
    return next(new ApiError("Couldn't find Product", 400));
  }

  return res.json({
    status: res.status,
    product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Create Products --------------------------- */
  /* ---------------------------- @ Route POST /api/v1/products --------------------------- */
  /* ---------------------------- @ Access Private --------------------------- */
  req.body.slug = slugify(req.body.title);

  const createdProduct = await ProductModel.create(req.body);

  return res.json({
    status: res.status,
    createdProduct,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Update Products --------------------------- */
  /* ---------------------------- @ Route PUT /api/v1/products/:id --------------------------- */
  /* ---------------------------- @ Access Private --------------------------- */
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);

  const updatedProduct = await ProductModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  if (!updatedProduct) {
    return next(new ApiError("Couldn't Update the Product", 400));
  }

  return res.json({
    status: res.status,
    updatedProduct,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Delete Products --------------------------- */
  /* ---------------------------- @ Route Delete /api/v1/products/:id --------------------------- */
  /* ---------------------------- @ Access Private --------------------------- */
  const { id } = req.params;
  const deleted = await ProductModel.findByIdAndDelete(id);
  if (!deleted) {
    return next(new ApiError("Couldn't find Product", 400));
  }

  return res.json({
    status: res.status,
    message: "Product Deleted",
  });
});
