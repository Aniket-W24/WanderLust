const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const MONGO_URL = process.env.ATLASDB_URL;
const MONGO_URL = "mongodb+srv://PYTHON-devil:Python123Devil@cluster0.y8og9oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


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
    initData.data = initData.data.map((obj)=> ({...obj, owner : "66574bff9c40137102c29a1a"}));  //add a property owner to every user data
    await Listing.insertMany(initData.data);
    console.log("data was initalised");
}

initDB();