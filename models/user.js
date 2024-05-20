const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); //for authentication -> hashing & salting

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

User.plugin(passportLocalMongoose);     //this will add username & password to the model along with hasing & salting and different methods.

module.exports = mongoose.model("User", userSchema);

