import express from 'express';
import { submitContact, getAllContacts, getContactById, updateContactStatus, deleteContact, getContactStats } from '../controllers/contact.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/submit', submitContact);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getAllContacts);
router.get('/stats', protect, authorize('admin'), getContactStats);
router.get('/:id', protect, authorize('admin'), getContactById);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;