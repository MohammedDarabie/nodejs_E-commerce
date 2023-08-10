const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");
const reviewModel = require("../../models/reviewModel");
//

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Rating Value Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings Value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid Review id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      reviewModel
        .findOne({ user: req.user._id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("A review was already created before")
            );
          }
        })
    ),
  validatorMiddleware,
];

exports.getSpecificReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      // Check for review Owner before Update,
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`No review Found with this id ${val}`)
          );
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(
              `You are not allowed to perform this action ${review.user} ${req.user._id}`
            )
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
       return reviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`No review Found with this id ${val}`)
            );
          }
          if (review.user.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(
                `You are not allowed to perform this action ${review.user} ${req.user._id}`
              )
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
