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
const tokengenerate = require("../utils/generateToken");
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
/* ---------------------------- @ Access Admin  --------------------------- */
exports.getUsers = factory.getAll(UserModel);
/* ---------------------------- @ desc Get Specific User --------------------------- */
/* ---------------------------- @ Route get /api/v1/users/:id --------------------------- */
/* ---------------------------- @ Access Admin  --------------------------- */
exports.getSpecificUser = factory.getOne(UserModel);
/* ---------------------------- @ desc Create User --------------------------- */
/* ---------------------------- @ Route Post /api/v1/users --------------------------- */
/* ---------------------------- @ Access Admin  --------------------------- */
exports.createUser = factory.createOne(UserModel);
/* ---------------------------- @ desc Update users --------------------------- */
/* ---------------------------- @ Route PUT /api/v1/users/:id --------------------------- */
/* ---------------------------- @ Access Admin  --------------------------- */
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
/* ---------------------------- @ Access Admin  --------------------------- */
exports.deleteUser = factory.deleteOne(UserModel);
/* ---------------------------- @ desc Update user Password --------------------------- */
/* ---------------------------- @ Route put /api/v1/users/:id --------------------------- */
/* ---------------------------- @ Access Admin  --------------------------- */
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

/* ---------------------------- @ desc Get Logged User --------------------------- */
/* ---------------------------- @ Route get /api/v1/users/getMe --------------------------- */
/* ---------------------------- @ Access Protect  --------------------------- */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

/* ---------------------------- @ desc Update Password Logged User --------------------------- */
/* ---------------------------- @ Route put /api/v1/users/updateMyPassword --------------------------- */
/* ---------------------------- @ Access Protect  --------------------------- */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangetAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = tokengenerate(user._id);

  res.status(200).json({
    message: "Successfully Changed",
    data: user,
    token,
  });
});

/* ---------------------------- @ desc Update Logged User Data --------------------------- */
/* ---------------------------- @ Route put /api/v1/users/updateMe --------------------------- */
/* ---------------------------- @ Access Protect  --------------------------- */
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    data: updatedUser,
  });
});

/* ---------------------------- @ desc Deactivate Logged User Data --------------------------- */
/* ---------------------------- @ Route delete /api/v1/users/deleteMe --------------------------- */
/* ---------------------------- @ Access Protect  --------------------------- */
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "Successfully Deactivated",
    data: user,
  });
});
