import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserData = new mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    // required: true
  },
  username: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  profileImage: {
    type: String,
    // required: true
  },
  mobileNumber: {
    type: Number,
    // required: true
  },
  friends: {
    type: Array,
    // required: true
  },
  trips: {
    type: Array,
    // required: true
  },
  posts: {
    type: Array,
    // required: true
  },
  badges: {
    type: Array,
    // required: true
  },
  role: {
    type: String,
    default: "user",
    // required: true
  },
});

UserData.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
    },
    process.env.AccessToken_SECRET,
    {
      expiresIn: process.env.AccessToken_EXPIRY,
    }
  );
};

UserData.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
    },
    process.env.RefreshToken_SECRET,
    {
      expiresIn: process.env.RefreshToken_EXPIRY,
    }
  );
};

const User = mongoose.model("User", UserData);

export default User;
