import multer from "multer";

const multerStorage = multer.memoryStorage();

const uploadFileTypeValidate = multer({
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
          "Invalid file type. Only JPEG, JPG, PNG, AVIF, MP4, and MKV are allowed."
        )
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // Set the maximum file size limit to 15 MB
  },
}).array("files", 5); // Limit to 5 files

const validateFileSize = (req, res, next) => {
  const maxImageSize = 5 * 1024 * 1024; // 5 MB
  const maxVideoSize = 15 * 1024 * 1024; // 15 MB

  for (const file of req.files) {
    if (["video/mp4", "video/mkv"].includes(file.mimetype)) {
      if (file.size > maxVideoSize) {
        return next(
          new Error(
            `Video file size should not exceed ${
              maxVideoSize / (1024 * 1024)
            } MB`
          )
        );
      }
    } else if (file.size > maxImageSize) {
      return next(
        new Error(
          `Image file size should not exceed ${maxImageSize / (1024 * 1024)} MB`
        )
      );
    }
  }
  next();
};

export { uploadFileTypeValidate, validateFileSize };
