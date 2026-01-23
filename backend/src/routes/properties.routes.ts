import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  searchProperties,
  getPropertiesByLocation,
} from '../controllers/property.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadPropertyImages } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/search', searchProperties);
router.get('/location/:location', getPropertiesByLocation);
router.get('/:id', getProperty);

// Protected routes (require authentication)
router.use(protect);
router.post('/', uploadPropertyImages, createProperty);
router.put('/:id', uploadPropertyImages, updateProperty);
router.delete('/:id', deleteProperty);

export default router;
