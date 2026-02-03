import express from 'express';
import { 
  createBlogPost, 
  getBlogPosts, 
  getBlogPostById,
  getPublicBlogPostById,
  getAdminBlogPosts,
  getBlogPostBySlug, 
  updateBlogPost, 
  deleteBlogPost, 
  publishBlogPost, 
  unpublishBlogPost, 
  archiveBlogPost, 
  unarchiveBlogPost,
  incrementViews,
  incrementLikes,
  getBlogPostsByCategory,
  getRelatedBlogPosts
} from '../controllers/blog.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all published blog posts (public)
router.get('/public', getBlogPosts);

// Get a specific published blog post by ID (public)
router.get('/public/:id', getPublicBlogPostById);

// Get a specific published blog post by slug (public)
router.get('/public/slug/:slug', getBlogPostBySlug);
// Get related blog posts (public)
router.get('/public/:id/related', getRelatedBlogPosts);

// Get all blog posts (admin)
router.get('/', protect, admin, getAdminBlogPosts);

// Get a specific blog post by ID (admin)
router.get('/:id', protect, admin, getBlogPostById);

// Create a new blog post (admin)
router.post('/', protect, admin, createBlogPost);

// Update a blog post (admin)
router.put('/:id', protect, admin, updateBlogPost);

// Delete a blog post (admin)
router.delete('/:id', protect, admin, deleteBlogPost);

// Publish a blog post (admin)
router.patch('/:id/publish', protect, admin, publishBlogPost);

// Unpublish a blog post (admin)
router.patch('/:id/unpublish', protect, admin, unpublishBlogPost);

// Archive a blog post (admin)
router.patch('/:id/archive', protect, admin, archiveBlogPost);

// Unarchive a blog post (admin)
router.patch('/:id/unarchive', protect, admin, unarchiveBlogPost);

// Increment views count for a blog post (public)
router.patch('/public/:id/views', incrementViews);

// Increment likes count for a blog post (public)
router.patch('/public/:id/likes', incrementLikes);

// Get blog posts by category (public)
router.get('/public/category/:category', getBlogPostsByCategory);

export default router;
