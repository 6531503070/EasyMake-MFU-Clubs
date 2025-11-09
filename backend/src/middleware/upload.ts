import multer from "multer";

const MAX_FILE_SIZE_MB = 20; 
const MAX_FILES = 10;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: MAX_FILES,
  },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(png|jpe?g|webp|gif|avif)$/.test(file.mimetype)) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname)
      );
    }
    cb(null, true);
  },
});
