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
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadAvatarImage } from '../middleware/upload.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/change-password', changePassword);
router.post('/avatar', uploadAvatarImage, uploadAvatar);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:propertyId', addToWishlist);
router.delete('/wishlist/:propertyId', removeFromWishlist);

// Admin routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
