import express from "express";
import Post from "./schema/post.js";
import dotenv from "dotenv";

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

postRoutes.post("/uploadPost", async (req, res) => {
  const newPost = new Post({
    createdBy: req.body.createdBy,
    collaborators: req.body.collaborators,
    likes: req.body.likes,
    comments: req.body.comments,
    caption: req.body.caption,
    heading: req.body.heading,
    location: req.body.location,
  });
  try {
    const savedPost = await newPost.save();
    res.json(`${newPost.createdBy} uploaded a post successfully.🎉`);
    console.log(`${newPost.createdBy} uploaded a post successfully.🎉`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "An error occurred while posting the 'post' data. Internal server error.",
    });
  }
});

export default postRoutes;
