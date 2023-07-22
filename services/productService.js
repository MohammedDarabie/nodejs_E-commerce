const ProductModel = require("../models/productModel");
const factory = require("./handlerFactory");
//

/* ---------------------------- @ desc Get List Product --------------------------- */
/* ---------------------------- @ Route GET /api/v1/products --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
/* -------------------------------  Build Query ------------------------------ */
exports.getProducts = factory.getAll(ProductModel, "Product");
/* ---------------------------- @ desc Get Specific Product --------------------------- */
/* ---------------------------- @ Route GET /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getProduct = factory.getOne(ProductModel);
/* ---------------------------- @ desc Create Products --------------------------- */
/* ---------------------------- @ Route POST /api/v1/products --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.createProduct = factory.createOne(ProductModel);
/* ---------------------------- @ desc Update Products --------------------------- */
/* ---------------------------- @ Route PUT /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.updateProduct = factory.updateOne(ProductModel);
/* ---------------------------- @ desc Delete Products --------------------------- */
/* ---------------------------- @ Route delete /api/v1/products/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.deleteProduct = factory.deleteOne(ProductModel);
