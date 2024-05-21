const express = require("express");
const router = express.Router(); //using Router to separate routes.
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

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

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to wanderlust! You are Logged in");
    res.redirect("/listings");
  }
);
//check for username -> Hulk, password -> hello

//for logout
router.get("/logout", (req, res, next)=> {
  req.logout((err)=> {    //passport provides logout method
    if(err){
      return next();
    }
    req.flash("success", "Logged you out")
    res.redirect("/listings");
  })
})

module.exports = router;
