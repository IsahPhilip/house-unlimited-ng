import express from 'express';
import { subscribe, getAllSubscribers, unsubscribe, getSubscriberCount } from '../controllers/newsletter.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getAllSubscribers);
router.get('/count', protect, authorize('admin'), getSubscriberCount);

export default router;
