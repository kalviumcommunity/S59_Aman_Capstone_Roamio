import express from "express";
import {
  uploadFileTypeValidate,
  validateFileSize,
} from "../middlewares/UploadFileValidate.js";
import { uploadNewPost, publicPost } from "../controllers/post.controller.js";
import uploadFileToFirebase from "../middlewares/uploadFileToFirebase.js";

const postRoutes = express.Router();

postRoutes.post(
  "/uploadPost",
  uploadFileTypeValidate,
  validateFileSize,
  (req, res, next) => {
    uploadFileToFirebase("posts", req, res, next), uploadNewPost;
  },
);

postRoutes.get("/publicPost", publicPost);

export default postRoutes;
