const mongoose = require("mongoose");
/* ------------------------------ create Schema ----------------------------- */
// 1- Create Schema
const categorySchema = new mongoose.Schema({
  name: String,
});

//  2 - Create Model
const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
