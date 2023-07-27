const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const ProductModel = require("../models/productModel");
const factory = require("./handlerFactory");
const { uploadImages } = require("../middlewares/uploadImageMiddleware");
//

exports.uploadProductImages = uploadImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // Image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    req.body.imageCover = imageCoverFilename;
  }
  // Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
    next();
  }
});
/* ---------------------------- @ desc Get List Product --------------------------- */
/* ---------------------------- @ Route GET /api/v1/products --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
/* -------------------------------  Build Query ------------------------------ */
exports.getProducts = factory.getAll(ProductModel, "Product");
/* ---------------------------- @ desc Get Specific Product --------------------------- */
/* ---------------------------- @ Route GET /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getProduct = factory.getOne(ProductModel);
/* ---------------------------- @ desc Create Products --------------------------- */
/* ---------------------------- @ Route POST /api/v1/products --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.createProduct = factory.createOne(ProductModel);
/* ---------------------------- @ desc Update Products --------------------------- */
/* ---------------------------- @ Route PUT /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.updateProduct = factory.updateOne(ProductModel);
/* ---------------------------- @ desc Delete Products --------------------------- */
/* ---------------------------- @ Route delete /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.deleteProduct = factory.deleteOne(ProductModel);
