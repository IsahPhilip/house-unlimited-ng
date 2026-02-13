import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // Import the configured cloudinary instance
import { Request } from 'express';

// Configure multer storage for Cloudinary
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: 'house-unlimited-ng',
      resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'heic', 'mp4', 'mov', 'webm'],
    };
  },
});

// File filter function (optional with Cloudinary, but good practice)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and videos only
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

// Create multer upload instance for a single generic file
export const uploadFileMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
}).single('file');

// Upload multiple property images
export const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
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
