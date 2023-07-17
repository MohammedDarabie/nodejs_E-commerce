const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddleware");

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
