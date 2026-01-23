import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary'; // Import the configured cloudinary instance
import { Request } from 'express';

// Configure multer storage for Cloudinary
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: 'house-unlimited-ng',
      allowed_formats: ['jpg', 'jpeg', 'png', 'heic'],
    };
  },
});

// File filter function (optional with Cloudinary, but good practice)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Create multer upload instance for a single generic file
export const uploadFileMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single('file');

// Upload multiple property images
export const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10, // Maximum 10 files
  },
}).array('images', 10);

// Upload single avatar
export const uploadAvatarImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
  },
}).single('avatar');
