const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/BrandModel");
//

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;
  next();
});
/* ---------------------------- @ desc Get All Product --------------------------- */
/* ---------------------------- @ Route Get /api/v1/products --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getBrands = factory.getAll(BrandModel);
/* ---------------------------- @ desc Get Specific Product --------------------------- */
/* ---------------------------- @ Route get /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getSpecificBrand = factory.getOne(BrandModel);
/* ---------------------------- @ desc Create Product --------------------------- */
/* ---------------------------- @ Route Post /api/v1/products --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.createBrand = factory.createOne(BrandModel);
//   /* ---------------------------- @ desc Update Product --------------------------- */
//   /* ---------------------------- @ Route PUT /api/v1/products/:id --------------------------- */
//   /* ---------------------------- @ Access Private  --------------------------- */
exports.updateBrand = factory.updateOne(BrandModel);
/* ---------------------------- @ desc Delete Product --------------------------- */
/* ---------------------------- @ Route delete /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.deleteBrand = factory.deleteOne(BrandModel);
