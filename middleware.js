//middleware to check if user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
  //console.log(req.user); //this will contain user logged in detail if logged in else undefined
  if (!req.isAuthenticated()) {
    //passport method will check if login or not
    req.session.redirectUrl = req.originalUrl || "/listings";      //save the url from where request came from 
    //if there is no path then "/listings" will be the home page
    req.flash("error", "You must be Loggen in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next)=> {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
