const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
//
//
dotenv.config({ path: "config.env" });
//
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddleware");
/* ------------------------------- Routes ------------------------------- */
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const BrandRoute = require("./routes/BrandRoute");
const ProductRoute = require("./routes/productRoute");
//
/* --------------------------- Connect to Database -------------------------- */
dbConnection();
/* ------------------------------ * Express App ----------------------------- */
const app = express();
/* ------------------------------- MiddleWares ------------------------------ */

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode : ", process.env.NODE_ENV);
} else {
  console.log(`mode : ${process.env.NODE_ENV}`);
}

/* ------------------------------- mount Route ------------------------------ */
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", BrandRoute);
app.use("/api/v1/products", ProductRoute);
/* ---------------------------- Not Found Routes ---------------------------- */
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this Route : ${req.originalUrl}`, 400));
});
/* ------------------------ Error Handling Middleware ----------------------- */
app.use(errorMiddleware);

const PORT = process.env.NODE_PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

/* ------------------- Handling Rejections Outside Express ------------------ */
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Server Shutdown");
    process.exit(1);
  });
});
