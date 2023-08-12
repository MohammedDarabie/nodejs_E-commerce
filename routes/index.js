const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const BrandRoute = require("./BrandRoute");
const ProductRoute = require("./productRoute");
const UserRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const wishListRoute = require("./wishlistRoute");
const addressesRoute = require("./addressesRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", BrandRoute);
  app.use("/api/v1/products", ProductRoute);
  app.use("/api/v1/users", UserRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishListRoute);
  app.use("/api/v1/addresses", addressesRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
};

module.exports = mountRoutes;
