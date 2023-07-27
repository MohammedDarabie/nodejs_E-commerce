const express = require("express");
const {
  createBrand,
  getBrands,
  updateBrand,
  getSpecificBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/BrandService");
const {
  createBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/Validators/BrandValidators");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
