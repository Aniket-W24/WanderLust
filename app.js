const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); //listing schema
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); //for async error handle
const ExpressError = require("./utils/ExpressError.js"); //custom Error Handling Class
const { listingSchema, reviewSchema } = require("./schema.js"); //for schema validations
const Review = require("./models/review.js"); //Review Model

const listings = require("./routes/listing.js");  //requiring the listings.js file as it contains all the /listings routes
const reviews = require("./routes/review.js");  //review routes 

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


app.use("/listings", listings);     //any route that has /listings will be in listings
app.use("/listings/:id/reviews", reviews);  //any route that has this path will be redirected to reviews




// 😂 Testing the Database
app.get("/testListing", (req, res) => {
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "By the Beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });
  sampleListing
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.send("testListing Working!");
});

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.get("*", (req, res, next) => {
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
