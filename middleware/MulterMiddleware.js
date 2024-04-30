import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configure Multer storage settings

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/product");
  },
  filename: (req, file, cb) => {
    const uniqueFileName = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = uniqueFileName + fileExtension;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"]; // Add "image/webp" for WebP format
  if (!allowedMimes.includes(file.mimetype)) {
    // Reject files with invalid MIME types
    return cb(new Error("File must be an image"));
  }
  cb(null, true);
};

const upLoad = multer({ storage: storage, fileFilter: fileFilter });

const handleImageUpload = upLoad.array("images", 5);


export { handleImageUpload };
