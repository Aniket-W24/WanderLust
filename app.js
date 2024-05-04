const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); //listing schema
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

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
app.get("/listings", async (req,res)=> {
    const allListings = await Listing.find({});       //find all listings
    res.render("listings/index.ejs", {allListings});
    // res.send("get listings is workign");
})

// 😂 Show Route
app.get("/listings/:id", async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

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

const port = 8080;

app.listen(port, () => {
  console.log(`Server is Listening to port ${port}`);
});
