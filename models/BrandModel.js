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
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
};

brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
