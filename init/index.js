const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async()=> {
    await Listing.deleteMany({});       //to clean the data
    initData.data = initData.data.map((obj)=> ({...obj, owner : "664f82e4bba8c459ed8ccd50"}));  //add a property owner to every user data
    await Listing.insertMany(initData.data);
    console.log("data was initalised");
}

initDB();