/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const CategoryModel = require("../models/categoryModel");
//
// /* -------------------------- Memory Storage Engine ------------------------- */
// const multerStorage = multer.memoryStorage();
// /* ------------------------------- File Filter ------------------------------ */
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only Images Allowed", 400), false);
//   }
// };
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);
    //  Save image into DB
    req.body.image = filename;
  }
  next();
});

/* ---------------------------- @ desc Get List Categories --------------------------- */
/* ---------------------------- @ Route GET /api/v1/categories --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getCategories = factory.getAll(CategoryModel);
/* ---------------------------- @ desc Create Categories --------------------------- */
/* ---------------------------- @ Route Post /api/v1/categories --------------------------- */
/* ---------------------------- @ Access Public --------------------------- */
exports.createCategory = factory.createOne(CategoryModel);
/* ---------------------------- @ desc Get Category --------------------------- */
/* ---------------------------- @ Route Post /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Public --------------------------- */
exports.getCategory = factory.getOne(CategoryModel);
/* ---------------------------- @ desc Update Specific Category --------------------------- */
/* ---------------------------- @ Route Put /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.updateCategory = factory.updateOne(CategoryModel);
/* ---------------------------- @ desc Delete Specific Category --------------------------- */
/* ---------------------------- @ Route delete /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.deleteCategory = factory.deleteOne(CategoryModel);
