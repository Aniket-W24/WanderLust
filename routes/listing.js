const express = require("express");
const router = express.Router(); //using Router to separate routes.
const wrapAsync = require("../utils/wrapAsync.js"); //for async error handle
const Listing = require("../models/listing.js"); //listing schema
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middlewares/user.js");
const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index)) // 😂 Index Route
  .post(
    // 😂 Create Route
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );

// 😂 New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // 😂 Show Route
  .put(
    // 😂 Update Route
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    // 😂 Delete Route
    isOwner,
    isLoggedIn,
    wrapAsync(listingController.destroyListing)
  );

// 😂 Edit Route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
