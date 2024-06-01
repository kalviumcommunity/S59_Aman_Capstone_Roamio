import express from "express";
import User from "./models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "./utils/ApiError.js";
import {
  uploadFileTypeValidate,
  validateFileSize,
} from "./middlewares/UploadFileValidate.js";
import uploadFileToFirebase from "./middlewares/uploadFileToFirebase.js";
import { addUser } from "./controllers/user.controller.js";
dotenv.config();

const userRoutes = express.Router();

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error occured while generating accessToken and refreshToken"
    );
  }
};

userRoutes.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const userNames = users.map((user) => ({
      name: user.name,
      joinedAt: user.createdAt,
    }));
    res.json(userNames);
  } catch (err) {
    res.json({ error: `An error occurred while getting the data. ${err}` });
  }
});

userRoutes.post('/add-user', uploadFileTypeValidate, validateFileSize, (req, res, next) => {
  uploadFileToFirebase('profile', req, res, next);
}, addUser);


userRoutes.get("/userExist", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", userFound: false });
    }
    return res.status(200).json({ message: "User found", userFound: true });
  } catch (error) {
    console.error(
      "Error encountered while verifying user existence in the database.",
      error
    );
    return res.status(500).json({
      message:
        "Error encountered in server while verifying user existence in the database.",
    });
  }
});

userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const passwordMatch = password === user.password;
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password! Please try again." });
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };
    console.log(`${user.username} logged in successfully !🎉`);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: `${user.username} logged in successfully !🎉` });
  } catch (error) {
    console.error("Error while logging in", error);
    return res.status(500).json({
      message: "Internal server error encountered while logging a user in.",
    });
  }
});

export default userRoutes;
