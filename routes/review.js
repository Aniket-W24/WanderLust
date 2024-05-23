const express = require("express");
const router = express.Router({ mergeParams: true }); //using Router to separate routes, mergeParams -> will send :id to this file.
const wrapAsync = require("../utils/wrapAsync.js"); //for async error handle
const Listing = require("../models/listing.js"); //listing schema
const Review = require("../models/review.js"); //Review Model
const { validateReview } = require("../middlewares/review.js"); //for validating review schema
const { isLoggedIn } = require("../middlewares/user.js");
const { isReviewAuthor } = require("../middlewares/review.js");

const reviewController = require("../controllers/reviews.js");

// 😂 Reviews Post Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// 😂 Reviews Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
