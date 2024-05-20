const express = require("express");
const router = express.Router(); //using Router to separate routes.
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//using try-catch to remain on same page if usernmae exists
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { email, username, password } = req.body;
      const newUser = new User({ email, username });
      let result = await User.register(newUser, password);
      console.log(result);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    } catch (er) {
      req.flash("error", "Username already exists");
      res.redirect("/signup");
    }
  })
);

module.exports = router;
