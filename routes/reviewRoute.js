const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdandUserIdtoBody,
} = require("../services/reviewService");

const {
  createReviewValidator,
  getSpecificReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/Validators/reviewValidator");

const authService = require("../services/authService");
//
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdandUserIdtoBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getSpecificReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "seller", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
