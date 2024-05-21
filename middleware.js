//middleware to check if user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {     //passport method will check if login or not
    req.flash("error", "You must be Loggen in!");
    return res.redirect("/login");
  }
  next();
};
