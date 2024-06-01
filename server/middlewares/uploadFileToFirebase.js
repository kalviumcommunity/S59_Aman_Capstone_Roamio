import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseConfig from "../config/firebase.config.js";
import { initializeApp } from "firebase/app";
import { ApiError } from "../utils/ApiError.js";

initializeApp(firebaseConfig.firebaseConfig);
const storage = getStorage();

async function uploadFileToFirebase(directoryName, req, res, next) {
  const username = req.body.username;

  if (directoryName === "profile" && (!req.files || req.files.length === 0)) {
    req.fileLinks = [];
    return next();
  } else if (!req.files || req.files.length === 0) {
    return next(new ApiError(400, "No files uploaded"));
  }

  const postImageLinks = [];

  try {
    await Promise.all(
      req.files.map(async (file, index) => {
        const postMediaName = `${username}_${Date.now()}_${index + 1}`;
        const storageRef = ref(storage, `${directoryName}/${postMediaName}`);
        const metadata = {
          contentType: file.mimetype,
          customMetadata: {
            uploadedBy: username,
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
      })
    );

    req.fileLinks = postImageLinks;
    next();
  } catch (error) {
    next(
      new ApiError(
        500,
        `An error occurred while uploading and creating file link: ${error.message}`
      )
    );
  }
}

export default uploadFileToFirebase;
