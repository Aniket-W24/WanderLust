const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); //custom Error Handling Class
const session = require("express-session"); //to make session id's and store associated info
const flash = require("connect-flash");   //to show flashes(messages that appear only once like new listing created)

const listings = require("./routes/listing.js"); //requiring the listings.js file as it contains all the /listings routes
const reviews = require("./routes/review.js"); //review routes

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //to include ejsMate for boilerPlate
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

const sessionOptions = {
  secret: "mysupersecretcode", //make it a difficult string like path variables
  resave: false,
  saveUninitialized: true,
  cookie: {
    // expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security
  },
};

app.use(session(sessionOptions)); //to use session -> for creating and using session id's for multiple pages
app.use(flash());     //to show flash messages on pages

app.use((req, res, next)=> {      //flash middleware
  res.locals.success = req.flash("success");
  next();
})

app.use("/listings", listings); //any route that has /listings will be in listings
app.use("/listings/:id/reviews", reviews); //any route that has this path will be redirected to reviews







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
