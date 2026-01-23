import express from 'express';
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getPropertyReviews,
  getUserReviews,
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/:id', getReview);
router.get('/property/:propertyId', getPropertyReviews);

// Protected routes
router.use(protect);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.get('/user/me', getUserReviews);

export default router;
