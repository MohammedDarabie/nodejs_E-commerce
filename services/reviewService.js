const factory = require("./handlerFactory");
const ReviewModel = require("../models/reviewModel");
//
exports.setProductIdandUserIdtoBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  console.log(req.body.user);
  console.log(req.body.product);
  next();
};
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
/* ---------------------------- @ desc Get All Reviews --------------------------- */
/* ---------------------------- @ Route Get /api/v1/reviews --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getReviews = factory.getAll(ReviewModel);
/* ---------------------------- @ desc Get Specific Reviews --------------------------- */
/* ---------------------------- @ Route get /api/v1/reviews/:id --------------------------- */
/* ---------------------------- @ Access Public  --------------------------- */
exports.getReview = factory.getOne(ReviewModel);
/* ------------------------------ Nested Route ------------------------------ */

/* ---------------------------- @ desc Create Reviews --------------------------- */
/* ---------------------------- @ Route Post /api/v1/reviews --------------------------- */
/* ---------------------------- @ Access Public  / protect / user --------------------------- */
exports.createReview = factory.createOne(ReviewModel);
//   /* ---------------------------- @ desc Update Reviews --------------------------- */
//   /* ---------------------------- @ Route PUT /api/v1/reviews/:id --------------------------- */
//   /* ---------------------------- @ Access Private / protect / user  --------------------------- */
exports.updateReview = factory.updateOne(ReviewModel);
/* ---------------------------- @ desc Delete Reviews --------------------------- */
/* ---------------------------- @ Route delete /api/v1/reviews/:id --------------------------- */
/* ---------------------------- @ Access Private / protect / user  --------------------------- */
exports.deleteReview = factory.deleteOne(ReviewModel);
