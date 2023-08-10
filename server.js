const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
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
const UserRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const wishListRoute = require("./routes/wishlistRoute");
const addressesRoute = require("./routes/addressesRoute");
//
/* --------------------------- Connect to Database -------------------------- */
dbConnection();
/* ------------------------------ * Express App ----------------------------- */
const app = express();
/* ------------------------------- MiddleWares ------------------------------ */
app.use(cors({}));
app.use(express.json());
// Access Static Files
app.use(express.static(path.join(__dirname, "uploads")));
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
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishListRoute);
app.use("/api/v1/addresses", addressesRoute);
/* ---------------------------- Not Found Routes ---------------------------- */
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this Route : ${req.originalUrl}`, 400));
});
/* -------c----------------- Error Handling Middleware ----------------------- */
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
