const express = require("express");
const router = express.Router(); //using Router to separate routes.
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/user.js");

const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignupForm);

//using try-catch to remain on same page if usernmae exists
router.post(
  "/signup",
  wrapAsync(userController.signup)
);

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,    //middleware to save path from where request came from
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);
//check for username -> Tony, password -> jarvis

//for logout
router.get("/logout", userController.logout);

module.exports = router;
