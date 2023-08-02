const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");

/* ----------------------------- Token generator ---------------------------- */
const tokengenerate = (id) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  return token;
};
/* --------------------------- Allowed To fundtion -------------------------- */
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
