const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js"); //custom Error Handling Class
const {listingSchema} = require("../schema.js");

module.exports.validateListing = (req, res, next) => {
    //middleware to check for validation
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(","); //join multiple details of message
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

//middleware to check if user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.user); //this will contain user logged in detail if logged in else undefined
    if (!req.isAuthenticated()) {
      //passport method will check if login or not
      req.session.redirectUrl = req.originalUrl; //save the url from where request came from
      //if there is no path then "/listings" will be the home page
      req.flash("error", "You must be Loggen in!");
      return res.redirect("/login");
    }
    next();
  };
  
  //middleware to save the path in session from where request came from
  module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  };

  //middleware to check whether owner is same who is trying to access
  module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
  }