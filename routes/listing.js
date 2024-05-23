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

// 😂 Index Route
router.get("/", wrapAsync(listingController.index));

// 😂 New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// 😂 Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// 😂 Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

// 😂 Edit Route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

// 😂 Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// 😂 Delete Route
router.delete(
  "/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
