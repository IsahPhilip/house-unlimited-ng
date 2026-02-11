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
  getRelatedBlogPosts,
  getBlogComments,
  addBlogComment,
  updateBlogComment,
  deleteBlogComment,
  likeBlogPost,
  unlikeBlogPost,
  bookmarkBlogPost,
  unbookmarkBlogPost,
  getBlogInteraction,
  getBookmarkedPosts
} from '../controllers/blog.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all published blog posts (public)
router.get('/public', getBlogPosts);

// Get current user's bookmarked posts (public/auth)
router.get('/public/bookmarks', protect, getBookmarkedPosts);

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

// Blog comments
router.get('/public/:id/comments', getBlogComments);
router.post('/public/:id/comments', protect, addBlogComment);
router.put('/public/comments/:commentId', protect, updateBlogComment);
router.delete('/public/comments/:commentId', protect, deleteBlogComment);

// Blog likes (toggle)
router.get('/public/:id/interaction', protect, getBlogInteraction);
router.post('/public/:id/like', protect, likeBlogPost);
router.delete('/public/:id/like', protect, unlikeBlogPost);

// Blog bookmarks
router.post('/public/:id/bookmark', protect, bookmarkBlogPost);
router.delete('/public/:id/bookmark', protect, unbookmarkBlogPost);

export default router;
