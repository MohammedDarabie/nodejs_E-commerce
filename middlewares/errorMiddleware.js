const sendErrorforDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorforProd = (err, res) =>
  res.json({
    status: err.status,
    message: err.message,
  });

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  //  if Development Phase
  if (process.env.NODE_ENV === "development") {
    return sendErrorforDev(err, res);
  }
  // if Production Phase
  return sendErrorforProd(err, res);
};

module.exports = errorMiddleware;
