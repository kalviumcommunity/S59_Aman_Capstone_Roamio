import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publicPost = asyncHandler(async (req, res, next) => {
  const publicPost = await Post.find({ isPublicPost: true });
  res
    .status(200)
    .json(
      next(
        new ApiResponse(
          200,
          publicPost,
          "public posts fetched successfully!🎉🚀"
        )
      )
    );
});

const uploadNewPost = asyncHandler(async (req, res, next) => {
  const { createdBy, collaborators, caption, location } = req.body;
  const postImageLinks = req.fileLinks;

  //JOI validation

  if (!postImageLinks || postImageLinks.length === 0) {
    throw new ApiError(409, "No images or videos are uploaded!");
  }

  const newPost = await Post.create({
    createdBy,
    collaborators,
    caption,
    location,
    postImage: postImageLinks,
  });

  res
    .status(201)
    .json(
      next(
        new ApiResponse(
          200,
          { newPost },
          `${createdBy} uploaded a post successfully. 🎉🚀`
        )
      )
    );
});

export { uploadNewPost, publicPost };
