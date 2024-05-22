const express = require("express");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const multer = require("multer");
const config = require("./config/firebase.config");

const imageRouter = express.Router();

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

imageRouter.post("/profile", upload.single(), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const storageRef = ref(storage, `profile/${req.file.originalname}`);
    const metadata = {
      contentType: req.file.mimetype,
    };

    const uploadFile = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const imageURL = await getDownloadURL(uploadFile.ref);

    return res.status(200).json({
      message: "Profile image uploaded to Firebase Storage successfully!",
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: imageURL,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = imageRouter;
