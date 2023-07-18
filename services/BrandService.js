const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/BrandModel");
const ApiError = require("../utils/apiError");
//

exports.createBrand = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Create Product --------------------------- */
  /* ---------------------------- @ Route Post /api/v1/products --------------------------- */
  /* ---------------------------- @ Access Public  --------------------------- */
  const { name } = req.body;
  const createdProuct = await BrandModel.create({
    name,
    slug: slugify(name),
  });

  return res.json({
    status: req.status,
    createdProuct,
  });
});

exports.getSpecificBrand = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Get Specific Product --------------------------- */
  /* ---------------------------- @ Route get /api/v1/products/:id --------------------------- */
  /* ---------------------------- @ Access Public  --------------------------- */
  const { id } = req.params;
  const product = await BrandModel.findById(id);
  if (!product) {
    return next(new ApiError("No Product Found", 400));
  }

  return res.json({
    status: res.status,
    product,
  });
});

exports.getAllBrands = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Get All Product --------------------------- */
  /* ---------------------------- @ Route Get /api/v1/products --------------------------- */
  /* ---------------------------- @ Access Public  --------------------------- */
  const allBrands = await BrandModel.find();
  return res.json({
    status: res.status,
    dataLength: allBrands.length,
    data: allBrands,
  });
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Update Product --------------------------- */
  /* ---------------------------- @ Route PUT /api/v1/products/:id --------------------------- */
  /* ---------------------------- @ Access Private  --------------------------- */
  const { id } = req.params;
  const { name } = req.body;
  const updatedProduct = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!updatedProduct) {
    return next(new ApiError("Couldn't find Brand", 400));
  }

  return res.json({
    status: res.status,
    data: updatedProduct,
  });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  /* ---------------------------- @ desc Delete Product --------------------------- */
  /* ---------------------------- @ Route delete /api/v1/products/:id --------------------------- */
  /* ---------------------------- @ Access Private  --------------------------- */
  const { id } = req.params;
  const deletedCategory = await BrandModel.deleteOne({ _id: id });

  if (!deletedCategory) {
    return next(new ApiError("Couldn't find Brand", 400));
  }

  return res.json({
    status: res.status,
    message: "Deleted Successfully",
  });
});
