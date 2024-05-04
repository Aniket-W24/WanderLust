const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); //listing schema

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
