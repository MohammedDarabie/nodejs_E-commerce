const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const { createCategories } = require("./services/categoryService");

/* --------------------------- Connect to Database -------------------------- */
dbConnection();
/* ------------------------------ * Express App ----------------------------- */
const app = express();
/* ------------------------------- MiddleWares ------------------------------ */
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode : ", process.env.NODE_ENV);
}

/* ------------------------------- mount Route ------------------------------ */
app.use('/api/v1/categories',categoryRoute)

const PORT = process.env.NODE_PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
