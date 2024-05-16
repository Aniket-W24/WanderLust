const express = require("express");
const router = express.Router(); //using Router to separate routes.
const { listingSchema } = require("../schema.js"); //for schema validations
const wrapAsync = require("../utils/wrapAsync.js"); //for async error handle
const ExpressError = require("../utils/ExpressError.js"); //custom Error Handling Class
const Listing = require("../models/listing.js"); //listing schema

const validateListing = (req, res, next) => {
    //middleware to check for validation
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(","); //join multiple details of message
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

// 😂 Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); //find all listings
    res.render("listings/index.ejs", { allListings });
    // res.send("get listings is workign");
  })
);

// 😂 New Route
router.get("/new", (req, res) => {
  //this route should be before show route else it will search for new as searching for id in db
  res.render("listings/new.ejs");
});

// 😂 Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); //to populate the reivews data instead of just id's
    res.render("listings/show.ejs", { listing });
  })
);

// 😂 Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing); //req.body.listing will get all the listing key-value pairs from form where we wrote listing[title],listing[image], etc.
    await newListing.save();
    res.redirect("/listings");
  })
);

// 😂 Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// 😂 Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //to desconstruct the key-value pairs
    res.redirect(`/listings/${id}`);
  })
);

// 😂 Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;