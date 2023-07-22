const express = require("express");
const {
  createBrand,
  getBrands,
  updateBrand,
  getSpecificBrand,
  deleteBrand,
} = require("../services/BrandService");
const {
  createBrandValidator,
  getSpecificBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/Validators/BrandValidators");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
