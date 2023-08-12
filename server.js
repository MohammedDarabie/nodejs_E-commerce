const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require("compression");

//
//
dotenv.config({ path: "config.env" });
//
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddleware");
/* ------------------------------- Routes ------------------------------- */
const mountRoutes = require("./routes");

//
/* --------------------------- Connect to Database -------------------------- */
dbConnection();
/* ------------------------------ * Express App ----------------------------- */
const app = express();
/* ------------------------------- MiddleWares ------------------------------ */
app.use(cors());
console.log("Hello World");
app.options("*", cors());
app.use(compression());
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
mountRoutes(app);
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
