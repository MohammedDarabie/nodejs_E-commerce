const mongoose = require("mongoose");
//
//
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategory already added"],
      required: [true, "Please Enter a SubCategory"],
      minlength: [2, "Too Short SubCategory name"],
      maxlength: [32, "Too Short SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to Parent Category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategoryModel;
