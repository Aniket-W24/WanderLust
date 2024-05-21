
const ExpressError = require("../utils/ExpressError.js"); //custom Error Handling Class
const {reviewSchema } = require("../schema.js"); //for schema validations
const Review = require("../models/review.js");  

//middleware for validating review
module.exports.validateReview = (req, res, next) => {
    //middleware to check for validation
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(","); //join multiple details of message
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
  }