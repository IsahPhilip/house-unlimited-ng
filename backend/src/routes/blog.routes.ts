import express from 'express';
import mongoose from 'mongoose';
import { BlogPost as BlogPostModel } from '../models/mongodb/BlogPost.mongoose.js';
import { protect, admin, AuthRequest } from '../middleware/auth.middleware.js';
import { IUser } from '../models/mongodb/User.mongoose.js';

const router = express.Router();

// Define a type for the populated author field for type safety
type PopulatedAuthor = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
};

// Get all published blog posts (public)
router.get('/public', async (req, res) => {
  try {
    const blogPosts = await BlogPostModel.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .populate<{ author: PopulatedAuthor }>('author', 'name email');

    const formattedPosts = blogPosts.map(post => ({
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
      publishedAt: post.publishedAt
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get a specific published blog post by ID (public)
router.get('/public/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogPostModel.findById(id).populate<{
      author: PopulatedAuthor;
    }>('author', 'name email');

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (blogPost.status !== 'published') {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: blogPost.author._id.toString(),
        name: blogPost.author.name,
        email: blogPost.author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Get all blog posts (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const blogPosts = await BlogPostModel.find()
      .sort({ createdAt: -1 })
      .populate<{ author: PopulatedAuthor }>('author', 'name email');

    const formattedPosts = blogPosts.map(post => ({
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
      publishedAt: post.publishedAt
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
    const blogPost = await BlogPostModel.findById(id).populate<{
      author: PopulatedAuthor;
    }>('author', 'name email');

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: blogPost.author._id.toString(),
        name: blogPost.author.name,
        email: blogPost.author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create a new blog post (admin)
router.post('/', protect, admin, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      status,
      readTime
    } = req.body;

    // Create new blog post
    const blogPost = new BlogPostModel({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      status,
      readTime,
      author: req.user?._id,
      views: 0,
      likes: 0,
      commentsCount: 0
    });

    await blogPost.save();

    // Populate author for response
    await blogPost.populate<{ author: PopulatedAuthor }>(
      'author',
      'name email'
    );

    const author = blogPost.author as unknown as PopulatedAuthor;

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: author._id.toString(),
        name: author.name,
        email: author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.status(201).json(formattedPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update a blog post (admin)
router.put('/:id', protect, admin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const blogPost = await BlogPostModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: blogPost.author._id.toString(),
        name: blogPost.author.name,
        email: blogPost.author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete a blog post (admin)
router.delete('/:id', protect, admin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPostModel.findByIdAndDelete(id);

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Publish a blog post (admin)
router.patch('/:id/publish', protect, admin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPostModel.findByIdAndUpdate(id, {
      status: 'published',
      publishedAt: new Date(),
    }, {
      new: true,
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: blogPost.author._id.toString(),
        name: blogPost.author.name,
        email: blogPost.author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error publishing blog post:', error);
    return res.status(500).json({ error: 'Failed to publish blog post' });
  }
});

// Unpublish a blog post (admin)
router.patch('/:id/unpublish', protect, admin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPostModel.findByIdAndUpdate(id, {
      status: 'draft',
      publishedAt: null,
    }, {
      new: true,
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: blogPost.author._id.toString(),
        name: blogPost.author.name,
        email: blogPost.author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error unpublishing blog post:', error);
    return res.status(500).json({ error: 'Failed to unpublish blog post' });
  }
});

// Archive a blog post (admin)
router.patch('/:id/archive', protect, admin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPostModel.findByIdAndUpdate(id, {
      status: 'archived',
    }, {
      new: true,
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: blogPost.author._id.toString(),
        name: blogPost.author.name,
        email: blogPost.author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error archiving blog post:', error);
    return res.status(500).json({ error: 'Failed to archive blog post' });
  }
});

// Unarchive a blog post (admin)
router.patch('/:id/unarchive', protect, admin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPostModel.findByIdAndUpdate(id, {
      status: 'draft',
    }, {
      new: true,
    }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const formattedPost = {
      id: blogPost._id.toString(),
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featuredImage: blogPost.featuredImage,
      category: blogPost.category,
      tags: blogPost.tags,
      author: {
        id: blogPost.author._id.toString(),
        name: blogPost.author.name,
        email: blogPost.author.email
      },
      status: blogPost.status,
      readTime: blogPost.readTime,
      views: blogPost.views,
      likes: blogPost.likes,
      commentsCount: blogPost.commentsCount,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      publishedAt: blogPost.publishedAt
    };

    return res.json(formattedPost);
  } catch (error) {
    console.error('Error unarchiving blog post:', error);
    return res.status(500).json({ error: 'Failed to unarchive blog post' });
  }
});

// Increment views count for a blog post (public)
router.patch('/public/:id/views', async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogPostModel.findById(id);

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (blogPost.status !== 'published') {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    blogPost.views += 1;
    await blogPost.save();

    return res.json({ views: blogPost.views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return res.status(500).json({ error: 'Failed to increment views' });
  }
});

// Increment likes count for a blog post (public)
router.patch('/public/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogPostModel.findById(id);

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    if (blogPost.status !== 'published') {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    blogPost.likes += 1;
    await blogPost.save();

    return res.json({ likes: blogPost.likes });
  } catch (error) {
    console.error('Error incrementing likes:', error);
    return res.status(500).json({ error: 'Failed to increment likes' });
  }
});

// Get blog posts by category (public)
router.get('/public/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const blogPosts = await BlogPostModel.find({ 
      status: 'published', 
      category 
    }).sort({ createdAt: -1 }).populate<{ author: PopulatedAuthor }>('author', 'name email');

    const formattedPosts = blogPosts.map(post => ({
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
      publishedAt: post.publishedAt
    }));

    return res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return res.status(500).json({ error: 'Failed to fetch blog posts by category' });
  }
});

export default router;
