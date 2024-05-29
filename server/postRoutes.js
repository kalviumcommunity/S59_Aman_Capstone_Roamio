import express from "express";
import Post from "./schema/post.js";
import dotenv from "dotenv";
import UploadFileValidate from "./middlewares/UploadFileValidate.js"
import { uploadPost } from "./controllers/post.controller.js";

dotenv.config();

const postRoutes = express.Router();

postRoutes.get("/", async (req, res) => {
  // will be deleted later for preventing data leak.
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.json({ error: "An error occurred while getting the data" });
  }
});

postRoutes.post("/uploadPost", UploadFileValidate.array('files', 10), uploadPost);


export default postRoutes;
