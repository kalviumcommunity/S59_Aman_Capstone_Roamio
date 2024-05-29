import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseConfig from "../config/firebase.config.js";
import { initializeApp } from "firebase/app";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Post from "../schema/post.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let firebaseApp, storage;

try {
  firebaseApp = initializeApp(firebaseConfig.firebaseConfig);
  storage = getStorage();
} catch (error) {
  console.log(`Firebase initialization error: ${error.message}`);
  throw new ApiError(500, `Firebase initialization error: ${error.message}`);
}

const uploadPost = asyncHandler(async (req, res) => {
  const { createdBy, collaborators, caption, location } = req.body;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(409, "No images or videos are uploaded!");
  }

  const postImageLinks = [];

  for (let i = 0; i < req.files.length; i++) {
    try {
      const file = req.files[i];
      const postMediaName = `${createdBy}_${Date.now()}_${i + 1}`;
      const storageRef = ref(storage, `posts/${postMediaName}`);
      const metadata = {
        contentType: file.mimetype,
        customMetadata: {
          uploadedBy: createdBy,
          uploadTime: new Date().toISOString(),
        },
      };
      const uploadFile = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      const imageURL = await getDownloadURL(uploadFile.ref);
      postImageLinks.push(imageURL);
    } catch (error) {
      console.error("Error occurred while uploading and creating file link: ", error);
      throw new ApiError(500, `An error occurred while uploading and creating file link: ${error.message}`);
    }
  }

  const newPost = new Post({
    createdBy,
    collaborators,
    caption,
    location,
    postImage: postImageLinks,
  });

  try {
    const savedPost = await newPost.save();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { postId: savedPost._id },
          `${createdBy} uploaded a post successfully. 🎉🚀`
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while saving the post to the database."
    );
  }
});

export { uploadPost };
