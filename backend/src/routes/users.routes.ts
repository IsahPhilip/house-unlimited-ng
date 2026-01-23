import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  getProfile,
  changePassword,
  uploadAvatar,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatarImage } from '../middleware/upload.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/change-password', changePassword);
router.post('/avatar', uploadAvatarImage, uploadAvatar);

// Admin routes (would need additional admin middleware)
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
