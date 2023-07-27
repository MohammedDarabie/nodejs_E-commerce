const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
//
const router = express.Router();
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/Validators/productValidator");
/* --------------------------------- Routes --------------------------------- */
router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
