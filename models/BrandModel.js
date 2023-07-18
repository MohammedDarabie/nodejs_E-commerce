const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: [true, "Product name must be unique"],
      minlength: [3, "Products name must be at least 3 characters"],
      maxlength: [32, "Products name must be at most 32 characters"],
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
