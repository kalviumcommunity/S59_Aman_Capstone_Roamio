import multer from "multer";

const multerStorage = multer.memoryStorage();
const uploadFileValidate = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/avif",
      "video/mp4",
      "video/mkv",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only JPEG , JPG , PNG , AVIF , MP4 and MKV are allowed ."
        )
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: (req, file, cb) => {
      if (["video/mp4", "video/mkv"].includes(file.mimetype)) {
        cb(null, 15 * 1024 * 1024); // 15 MB for videos
      } else {
        cb(null, 5 * 1024 * 1024); //5 MB for images
      }
    },
  },
});

export default uploadFileValidate;
