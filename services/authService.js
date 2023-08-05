const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/SendEmail");
const tokengenerate = require("../utils/generateToken");


/* --------------------------- Allowed To function -------------------------- */
// Admin , Seller
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to perform this action", 403)
      );
    }
    next();
  });
/* ----------------------------- Protect Routes ----------------------------- */
exports.protect = asyncHandler(async (req, res, next) => {
  // Check if Token Exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not Logged in please Login in to access this route",
        401
      )
    );
  }
  // Verify Token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // Check if User Exists
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return next(new ApiError("User no Longer Exists", 401));
  }
  // check if User Changed his password after token created
  if (user.passwordChangetAt) {
    const passwordChangedtimeStamp = parseInt(
      user.passwordChangetAt.getTime() / 1000,
      10
    );
    if (passwordChangedtimeStamp > decoded.iat) {
      return next(new ApiError("Password was Changed , Log in Again"));
    }
  }
  req.user = user;
  next();
});
/* ----------------------------- @ desc Sign Up  ---------------------------- */
/* ----------------------------- @ Route /api/v1/auth/signup ---------------------------- */
/* ----------------------------- @ Access Public ---------------------------- */
exports.signUp = asyncHandler(async (req, res, next) => {
  // Create a new User
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // Generte a JSON web token
  const token = tokengenerate(user._id);

  res.status(201).json({ data: user, token });
});
/* ----------------------------- @ desc Sign In  ---------------------------- */
/* ----------------------------- @ Route /api/v1/auth/signin ---------------------------- */
/* ----------------------------- @ Access Public ---------------------------- */
exports.logIn = asyncHandler(async (req, res, next) => {
  // Check if password and email exist in req.body (validation layer)
  // Email exists in Database & check if pass is correct
  const user = await UserModel.findOne({ email: req.body.email });
  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!user || !isCorrectPassword) {
    return next(new ApiError("Incorrect password/Email", 400));
  }
  // generte Token
  const token = tokengenerate(user._id);
  // Send response
  res.status(200).json({
    data: user,
    token,
  });
});

/* ----------------------------- @ desc Forgot Password  ---------------------------- */
/* ----------------------------- @ Route /api/v1/auth/forgotPassword ---------------------------- */
/* ----------------------------- @ Access Public ---------------------------- */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not Found", 404));
  }
  // If user exist, Generate hashed reset random 6 didgit and save it in db
  const resetcode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetcode)
    .digest("hex");
  // Save password hasehd resetCode into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for reset token (10 mins)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  // Send the reset code via email
  const message = `Hi ${user.name}, \n We recevied your request to reset the password on your E-Shop Account 
  \n ${resetcode} 
  \n Enter this code to complete the rest 
  \n Thanks for helping us to keep your account Secure`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset (Valid for 10 mins)",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There was an error in sending Email", 500));
  }
  res.status(200).json({
    message: "Email sent Successfully",
  });
});

/* ----------------------------- @ desc Verify Password Reset Code  ---------------------------- */
/* ----------------------------- @ Route /api/v1/auth/verifyPassword ---------------------------- */
/* ----------------------------- @ Access Public ---------------------------- */
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  //  get user based on reset Code
  const hasedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetcode)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetCode: hasedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("reset Code invalid or Expired"));
  }

  // Reset code Valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

/* ----------------------------- @ desc Update Password  ---------------------------- */
/* ----------------------------- @ Route /api/v1/auth/resetPassword ---------------------------- */
/* ----------------------------- @ Access Public ---------------------------- */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ApiError("There is no User with this Email", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset Code not yet Verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = tokengenerate(user._id);

  res.status(200).json({
    token,
  });
});
