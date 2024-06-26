import express from "express";
import {
  uploadFileTypeValidate,
  validateFileSize,
} from "../middlewares/UploadFileValidate.js";
import uploadFileToFirebase from "../middlewares/uploadFileToFirebase.js";
import {
  addUser,
  doesUserExist,
  googleAuth,
  loginUser,
  logoutUser,
  refreshAccessToken,
  userPublicDetails,
} from "../controllers/user.controller.js";
import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
  max: 5,
  message: "too many login attempts from this IP  , Please try again later",
});

const userRoutes = express.Router();

userRoutes.get("/", userPublicDetails);

userRoutes.post(
  "/add-user",
  uploadFileTypeValidate,
  validateFileSize,
  (req, res, next) => {
    uploadFileToFirebase("profile", req, res, next);
  },
  addUser
);

userRoutes.get("/doesUserExist", doesUserExist);

userRoutes.post("/login", loginLimiter, loginUser);

userRoutes.post("/logout", logoutUser);

userRoutes.post("/refreshAccessToken", refreshAccessToken);

userRoutes.post("/googleAuthentication", googleAuth);

export default userRoutes;
