const BrandModel = require("../models/BrandModel");
const factory = require("./handlerFactory");
//

/* ---------------------------- @ desc Get All Product --------------------------- */
/* ---------------------------- @ Route Get /api/v1/products --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getBrands = factory.getAll(BrandModel);
/* ---------------------------- @ desc Get Specific Product --------------------------- */
/* ---------------------------- @ Route get /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getSpecificBrand = factory.getOne(BrandModel);
/* ---------------------------- @ desc Create Product --------------------------- */
/* ---------------------------- @ Route Post /api/v1/products --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.createBrand = factory.createOne(BrandModel);
//   /* ---------------------------- @ desc Update Product --------------------------- */
//   /* ---------------------------- @ Route PUT /api/v1/products/:id --------------------------- */
//   /* ---------------------------- @ Access Private  --------------------------- */
exports.updateBrand = factory.updateOne(BrandModel);
/* ---------------------------- @ desc Delete Product --------------------------- */
/* ---------------------------- @ Route delete /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Private  --------------------------- */
exports.deleteBrand = factory.deleteOne(BrandModel);
