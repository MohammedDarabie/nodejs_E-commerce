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
  // Copy Query to Object
  /* ------------------------------- Filteration ------------------------------ */
  // const queryStringObject = { ...req.query };
  // // Excluded Fields
  // const excludedFields = ["page", "sort", "limit", "fields","keyword"];
  // // Search for Fields and Exclude them
  // excludedFields.forEach((field) => delete queryStringObject[field]);
  // /* -------------------------  // Add '$' to req.query ------------------------ */
  // let queryStr = JSON.stringify(queryStringObject);
  // queryStr = queryStr.replace(
  //   /\b(gte|gt|lte|lt)\b/g,
  //   (match) => `$${match}`
  // );
  /* ------------------------------- Pagination ------------------------------- */
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 50;
  // const skip = (page - 1) * limit;

  /* -------------------------------  Build Query ------------------------------ */
  const documentCounts = await ProductModel.countDocuments()
  const apiFeatures = new APIFeatures(ProductModel.find(), req.query)
    .paginate(documentCounts)
    .filter()
    .search()
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

  // .populate({ path: "category", select: "name -_id" });

  /* ------------------------------- // Sorting ------------------------------- */
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   mongooseQuery = mongooseQuery.sort(sortBy);
  // } else {
  //   mongooseQuery = mongooseQuery.sort("-createdAt");
  // }

  /* ----------------------------- Fields Limiting ---------------------------- */
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   mongooseQuery = mongooseQuery.select(fields);
  // } else {
  //   mongooseQuery = mongooseQuery.select("-__v");
  // }
  /* -------------------------------- Searching ------------------------------- */
  // if (req.query.keyword) {
  //   const query = {};
  //   query.$or = [
  //     { title: { $regex: req.query.keyword, $options: "i" } },
  //     { description: { $regex: req.query.keyword, $options: "i" } },
  //   ];
  //   mongooseQuery = mongooseQuery.find(query);
  // }
  /* ------------------------------ Execute Query ----------------------------- */
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
