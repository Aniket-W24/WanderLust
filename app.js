if (process.env.NODE_ENV != "production") {
  //only access if not in production phase
  require("dotenv").config(); //for accessing environment variables
}
// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); //custom Error Handling Class
const session = require("express-session"); //to make session id's and store associated info
const flash = require("connect-flash"); //to show flashes(messages that appear only once like new listing created)
const passport = require("passport"); //for authentication
const LocalStratergy = require("passport-local"); //local stratergy i.e username & password
const User = require("./models/user.js"); //user model

const listingRouter = require("./routes/listing.js"); //requiring the listings.js file as it contains all the /listings routes
const reviewRouter = require("./routes/review.js"); //review routes
const userRouter = require("./routes/user.js"); //user routes
const MongoStore = require("connect-mongo"); //for session storage in mongo

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //to include ejsMate for boilerPlate
app.use(express.static(path.join(__dirname, "/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "mysupersecretcode", //for encyption (SecretCookie etc.)
  },
  touchAfter: 24 * 3600, //to refresh session (24 hours / in seconds given)
});

const sessionOptions = {
  store,
  secret: "mysupersecretcode", //make it a difficult string like path variables
  resave: false,
  saveUninitialized: true,
  cookie: {
    // expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security
  },
};

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE", err);
});

app.use(session(sessionOptions)); //to use session -> for creating and using session id's for multiple pages
app.use(flash()); //to show flash messages on pages

app.use(passport.initialize()); //middleware that initialize passport
app.use(passport.session()); //as passport uses session for diff pages
passport.use(new LocalStratergy(User.authenticate())); //authenticate method to authenticate user

passport.serializeUser(User.serializeUser()); //to store in session
passport.deserializeUser(User.deserializeUser()); //to remove when session ends

app.use((req, res, next) => {
  //flash middleware
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //to pass to ejs page which will check if user is logged in or not as
  // req.user -> undefined if not logged in and have obj if logged in
  next();
});

app.get("/registerUser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student", //passport will check for whether username is unique or not
  });

  let newUser = await User.register(fakeUser, "helloWorld"); //automatically adds salt & hasing to the given password
  res.send(newUser);
});

app.use("/listings", listingRouter); //any route that has /listings will be in listings
app.use("/listings/:id/reviews", reviewRouter); //any route that has this path will be redirected to reviews
app.use("/", userRouter); //any route that belongs to user signup

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!")); //for routes that don't exists
});

app.use((err, req, res, next) => {
  //middleware to handle error
  let { statusCode = 500, message } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

const port = 8080;

app.listen(port, () => {
  console.log(`Server is Listening to port ${port}`);
});
