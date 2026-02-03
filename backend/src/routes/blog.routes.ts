import express from 'express';
import { 
  createBlogPost, 
  getBlogPosts, 
  getBlogPostById, 
  getBlogPostBySlug, 
  updateBlogPost, 
  deleteBlogPost, 
  publishBlogPost, 
  unpublishBlogPost, 
  archiveBlogPost, 
  unarchiveBlogPost,
  incrementViews,
  incrementLikes,
  getBlogPostsByCategory
} from '../controllers/blog.controller.js';
import { protect, admin, AuthRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

// Define a type for the populated author field for type safety
type PopulatedAuthor = {
  _id: string;
  name: string;
  email: string;
};

// Get all published blog posts (public)
router.get('/public', getBlogPosts);

// Get a specific published blog post by ID (public)
router.get('/public/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const BlogPost = (await import('../models/mongodb/BlogPost.mongoose.js')).BlogPost;
    const post = await BlogPost.findById(id).populate<{ author: PopulatedAuthor }>('author', 'name email');

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (post.status !== 'published') {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: {
        id: post.author._id.toString(),
        name: post.author.name,
        email: post.author.email
      },
      status: post.status,
      readTime: post.readTime,
      views: post.views,
      likes: post.likes,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Get a specific published blog post by slug (public)
router.get('/public/slug/:slug', getBlogPostBySlug);

// Get all blog posts (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    // Get all posts including drafts and archived
    const BlogPost = (await import('../models/mongodb/BlogPost.mongoose.js')).BlogPost;
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .populate<{ author: PopulatedAuthor }>('author', 'name email');

    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: {
        id: post.author._id.toString(),
        name: post.author.name,
        email: post.author.email
      },
      status: post.status,
      readTime: post.readTime,
      views: post.views,
      likes: post.likes,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription
    }));

    return res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get a specific blog post by ID (admin)
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const BlogPost = (await import('../models/mongodb/BlogPost.mongoose.js')).BlogPost;
    const post = await BlogPost.findById(id).populate<{
      author: PopulatedAuthor;
    }>('author', 'name email');

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: {
        id: post.author._id.toString(),
        name: post.author.name,
        email: post.author.email
      },
      status: post.status,
      readTime: post.readTime,
      views: post.views,
      likes: post.likes,
      commentsCount: post.commentsCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

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