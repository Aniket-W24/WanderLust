const express = require("express");
const router = express.Router({mergeParams : true}); //using Router to separate routes, mergeParams -> will send :id to this file.
const {reviewSchema } = require("../schema.js"); //for schema validations
const wrapAsync = require("../utils/wrapAsync.js"); //for async error handle
const ExpressError = require("../utils/ExpressError.js"); //custom Error Handling Class
const Listing = require("../models/listing.js"); //listing schema
const Review = require("../models/review.js"); //Review Model

const validateReview = (req, res, next) => {
    //middleware to check for validation
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(","); //join multiple details of message
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };


// 😂 Reviews Post Route
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review); //making review details
  
      listing.reviews.push(newReview);
  
      await newReview.save();
      await listing.save();
  
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  // 😂 Reviews Delete Route
  router.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {
      let { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //removes the matching reviewId from array
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/listings/${id}`);
    })
  );

  module.exports = router;