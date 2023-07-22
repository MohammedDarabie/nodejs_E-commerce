const CategoryModel = require("../models/categoryModel");
const factory = require("./handlerFactory");
//
/* ---------------------------- @ desc Get List Categories --------------------------- */
/* ---------------------------- @ Route GET /api/v1/categories --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getCategories = factory.getAll(CategoryModel);
/* ---------------------------- @ desc Create Categories --------------------------- */
/* ---------------------------- @ Route Post /api/v1/categories --------------------------- */
/* ---------------------------- @ Access Public --------------------------- */
exports.createCategory = factory.createOne(CategoryModel);
/* ---------------------------- @ desc Get Category --------------------------- */
/* ---------------------------- @ Route Post /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Public --------------------------- */
exports.getCategory = factory.getOne(CategoryModel);
/* ---------------------------- @ desc Update Specific Category --------------------------- */
/* ---------------------------- @ Route Put /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.updateCategory = factory.updateOne(CategoryModel);
/* ---------------------------- @ desc Delete Specific Category --------------------------- */
/* ---------------------------- @ Route delete /api/v1/categories/:id --------------------------- */
/* ---------------------------- @ Access Private --------------------------- */
exports.deleteCategory = factory.deleteOne(CategoryModel);
