import express from "express";
import {
  uploadFileTypeValidate,
  validateFileSize,
} from "../middlewares/UploadFileValidate.js";
import uploadFileToFirebase from "../middlewares/uploadFileToFirebase.js";
import {
  addUser,
  deleteUser,
  doesUserExist,
  googleAuth,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePasswordUsingOldPassword,
  updateUserDetails,
  userDetails,
  userPublicDetails,
  verifyUser,
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

userRoutes.get("/verifyUser", verifyUser);

userRoutes.get("/userDetails", userDetails);

userRoutes.put(
  "/updateUser",
  uploadFileTypeValidate,
  validateFileSize,
  (req, res, next) => {
    uploadFileToFirebase("profile", req, res, next);
  },
  updateUserDetails
);

userRoutes.patch(
  "/updatePasswordUsingOldPassword",
  updatePasswordUsingOldPassword
);

userRoutes.delete("/deleteUser", deleteUser);

export default userRoutes;
