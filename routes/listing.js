const express = require("express");
const router = express.Router(); //using Router to separate routes.
const wrapAsync = require("../utils/wrapAsync.js"); //for async error handle
const multer = require("multer"); //for file uploads
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage }); //destination where file will be saved

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
    upload.single("listing[image]"), //for uploading image
    validateListing,
    wrapAsync(listingController.createListing)
  );

// 😂 New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/findByGenre", wrapAsync(listingController.renderByGenre));   //to find listing based on some genre

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // 😂 Show Route
  .put(
    // 😂 Update Route
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), //for uploading image
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
