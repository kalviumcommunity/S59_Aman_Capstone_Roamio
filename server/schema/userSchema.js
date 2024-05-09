const mongoose = require("mongoose");

const data = new mongoose.Schema({
  name: {
    type: String,
    // required : true
  },
  email: {
    type: String,
    // required : true
  },
  password: {
    type: String,
    // required : true
  },
  image: {
    type: String,
    // required : true
  },
  mobileNumber: {
    type: Number,
    // required : true
  },
  friends: {
    type: Array,
    // required : true
  },
  trips: {
    type: Array,
    // required : true
  },
  posts: {
    type: Array,
    // required : true
  },
  badges: {
    type: Array,
    // required : true
  },
});

const dataSet = mongoose.model("users", data);

module.exports = dataSet;
