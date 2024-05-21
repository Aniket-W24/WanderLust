const express = require("express");
const router = express.Router({mergeParams : true}); //using Router to separate routes, mergeParams -> will send :id to this file.
const wrapAsync = require("../utils/wrapAsync.js"); //for async error handle
const Listing = require("../models/listing.js"); //listing schema
const Review = require("../models/review.js"); //Review Model
const {validateReview} = require("../middlewares/review.js"); //for validating review schema
const { isLoggedIn } = require("../middlewares/user.js");

// 😂 Reviews Post Route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review); //making review details
      newReview.author = req.user._id;
      console.log(newReview);
      listing.reviews.push(newReview);
  
      await newReview.save();
      await listing.save();
      
      req.flash("success", "Review Posted");
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
      req.flash("success", "Review Deleted");
      res.redirect(`/listings/${id}`);
    })
  );

  module.exports = router;