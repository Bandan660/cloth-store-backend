import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Configure Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/images/product";

    // Check if directory exists and create it if not
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    } else {
      console.log(`Directory exists: ${dir}`);
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = uniqueFileName + fileExtension;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedMimes.includes(file.mimetype)) {
    // Reject files with invalid MIME types
    return cb(new Error("File must be an image"));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const handleImageUpload = upload.array("images", 10);

export { handleImageUpload };
