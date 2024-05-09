const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); //listing schema
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
// 😂 Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({}); //find all listings
  res.render("listings/index.ejs", { allListings });
  // res.send("get listings is workign");
});

// 😂 New Route
app.get("/listings/new", (req, res) => {
  //this route should be before show route else it will search for new as searching for id in db
  res.render("listings/new.ejs");
});

// 😂 Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// 😂 Create Route
app.post("/listings", async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing); //req.body.listing will get all the listing key-value pairs from form where we wrote listing[title],listing[image], etc.
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

// 😂 Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// 😂 Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //to desconstruct the key-value pairs
  res.redirect(`/listings/${id}`);
});

// 😂 Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

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

app.use((err, req, res, next) => {
  //middleware to handle error
  res.send("Something Went Wrong !");
});

const port = 8080;

app.listen(port, () => {
  console.log(`Server is Listening to port ${port}`);
});
