const ApiError = require("../utils/apiError");

/* eslint-disable no-else-return */
const sendErrorforDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorforProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJWTInvalidSignature = () =>
  new ApiError("Invalid token , please Log in again ", 401);
const handleJWTExpiredSignature = () =>
  new ApiError("Expired token , please Log in again ", 401);

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  //  if Development Phase
  if (process.env.NODE_ENV === "development") {
    return sendErrorforDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJWTInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredSignature();
    return sendErrorforProd(err, res);
  }
};

module.exports = errorMiddleware;
