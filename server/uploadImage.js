import express from 'express';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import multer from 'multer';
import config from './config/firebase.config.js';

const imageRouter = express.Router();

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

imageRouter.post('/profile', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storageRef = ref(storage, `profile/${req.file.originalname}`);
    const metadata = {
      contentType: req.file.mimetype,
    };

    const uploadFile = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

    const imageURL = await getDownloadURL(uploadFile.ref);

    return res.status(200).json({
      message: 'Profile image uploaded to Firebase Storage successfully!',
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: imageURL,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default imageRouter;
