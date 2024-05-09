const express = require("express");
const postRoutes = express.Router();
const Post = require("./schema/post.js");
require("dotenv").config();

postRoutes.get("/", async (req, res) => {
  // will be deleted later for preventing data leak.
  try {
    const post = await Post.find();
    res.json(post);
  } catch (error) {
    res.json({ error: `An error occured while getting the data` });
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
    const savePost = await newPost.save();
    res.json(`${newPost.createdBy} uploaded a post successfully.🎉`);
    console.log(`${newPost.createdBy} uploaded a post successfully.🎉`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "An error occured while posting the 'post' data . Internal server error.",
      });
  }
});

module.exports = postRoutes;
