const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/apiError");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const UserModel = require("../models/userModel");
//

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImg = filename;
  }
  next();
});
/* ---------------------------- @ desc Get All Users --------------------------- */
/* ---------------------------- @ Route Get /api/v1/users --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.getUsers = factory.getAll(UserModel);
/* ---------------------------- @ desc Get Specific User --------------------------- */
/* ---------------------------- @ Route get /api/v1/users/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.getSpecificUser = factory.getOne(UserModel);
/* ---------------------------- @ desc Create User --------------------------- */
/* ---------------------------- @ Route Post /api/v1/users --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.createUser = factory.createOne(UserModel);
/* ---------------------------- @ desc Update users --------------------------- */
/* ---------------------------- @ Route PUT /api/v1/users/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(
      new ApiError(`Couldn't Update the doc with id: ${req.params.id}`, 400)
    );
  }

  return res.json({
    status: res.status,
    document,
  });
});
/* ---------------------------- @ desc Delete users --------------------------- */
/* ---------------------------- @ Route delete /api/v1/users/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.deleteUser = factory.deleteOne(UserModel);
/* ---------------------------- @ desc Update user Password --------------------------- */
/* ---------------------------- @ Route delete /api/v1/users/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangetAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError("No document Found", 400));
  }

  res.json({
    status: 200,
    document,
  });
});
