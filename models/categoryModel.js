const mongoose = require("mongoose");
/* ------------------------------ create Schema ----------------------------- */
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Required"],
      unique: [true, "Name must be Unique"],
      minlength: [3, "Category Name must be more than 3 or more"],
      maxlength: [32, "Category name must be maximum length of 32"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

//  2 - Create Model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
