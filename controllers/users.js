const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    let result = await User.register(newUser, password);
    console.log(result);
    req.login(newUser, (err) => {
      //to directly login after signup
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (er) {
    req.flash("error", "Username already exists");
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to wanderlust! You are Logged in");
  let redirectUrl = res.locals.redirectUrl || "/listings"; //we saved in middleware
  // console.log(redirectUrl);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    //passport provides logout method
    if (err) {
      return next();
    }
    req.flash("success", "Logged you out");
    res.redirect("/listings");
  });
};
