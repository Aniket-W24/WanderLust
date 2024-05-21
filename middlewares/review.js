
const ExpressError = require("../utils/ExpressError.js"); //custom Error Handling Class
const {reviewSchema } = require("../schema.js"); //for schema validations

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