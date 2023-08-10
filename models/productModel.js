const mongoose = require("mongoose");
//
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      miinlength: [3, "Too Short Product Title"],
      maxlength: [100, "Too Long Product Title"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [3, "description is Required"],
      minlength: [20, "Too Short Product Description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity is Required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product Price is Required"],
      trim: true,
      max: [200000, "Too long Product Price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is Required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must Belong to a Category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be below or equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

/* ------------------------ Mongoose Query middleware ----------------------- */
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageURl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageURl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageURl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageURl);
    });
    doc.images = imagesList;
  }
};

productSchema.post("init", (doc) => {
  setImageUrl(doc);
});
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
