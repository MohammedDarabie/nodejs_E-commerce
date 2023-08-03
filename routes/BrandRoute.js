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
const authService = require("../services/authService");
// 
const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authService.protect,
    authService.allowedTo("seller", "admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(
    authService.protect,
    authService.allowedTo("seller", "admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
