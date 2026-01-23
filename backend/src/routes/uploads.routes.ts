import express from 'express';
import { uploadFile, deleteFile, getFiles } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadFileMiddleware } from '../middleware/upload.js';

const router = express.Router();

// All upload routes require authentication
router.use(protect);

router.post('/', uploadFileMiddleware, uploadFile);
router.get('/', getFiles);
router.delete('/:publicId', deleteFile);

export default router;
