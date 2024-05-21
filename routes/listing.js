const express = require("express");
const router = express.Router(); //using Router to separate routes.
const wrapAsync = require("../utils/wrapAsync.js"); //for async error handle
const Listing = require("../models/listing.js"); //listing schema
const { isLoggedIn, isOwner, validateListing } = require("../middlewares/user.js");

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
router.get("/new", isLoggedIn, (req, res) => {
  //this route should be before show route else it will search for new as searching for id in db
  res.render("listings/new.ejs");
});

// 😂 Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner"); //to populate the reivews data instead of just id's
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// 😂 Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing); //req.body.listing will get all the listing key-value pairs from form where we wrote listing[title],listing[image], etc.
    newListing.owner = req.user._id; //to add owner
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

// 😂 Edit Route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// 😂 Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //to desconstruct the key-value pairs
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

// 😂 Delete Route
router.delete(
  "/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
