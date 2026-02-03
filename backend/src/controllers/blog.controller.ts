import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { BlogPost, IBlogPost } from '../models/mongodb/BlogPost.mongoose.js';

// Type guard to check if author is populated.
// A populated author will be an object with at least _id, name, and email.
const isAuthorPopulated = (
  author: any
): author is { _id: mongoose.Types.ObjectId; name: string; email: string } => {
  return author instanceof Object && '_id' in author && 'name' in author && 'email' in author;
};

// Centralized function to format blog post for API responses
const formatPostResponse = (post: IBlogPost) => {
  const author = isAuthorPopulated(post.author)
    ? {
        id: post.author._id.toString(),
        name: post.author.name,
        email: post.author.email,
      }
    : null;

  return {
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    category: post.category,
    tags: post.tags,
    author,
    status: post.status,
    readTime: post.readTime,
    views: post.views,
    likes: post.likes,
    commentsCount: post.commentsCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
  };
};

// A basic error handler for async functions to avoid repeating try-catch blocks
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// @desc    Create a new blog post
// @route   POST /api/blog
// @access  Private/Admin
export const createBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, status, tags, featuredImage, metaTitle, metaDescription, excerpt, category, readTime } = req.body;

  if (!title || !content || !excerpt || !category || !readTime) {
    res.status(400);
    throw new Error('Title, content, excerpt, category, and read time are required');
  }

  const blogPost = new BlogPost({
    title,
    content,
    author: req.user!._id,
    status,
    tags,
    featuredImage,
    metaTitle,
    metaDescription,
    excerpt,
    category,
    readTime
  });

  const createdPost = await blogPost.save();
  const populatedPost = await createdPost.populate('author', 'name email');

  res.status(201).json(formatPostResponse(populatedPost));
});

// @desc    Get all published blog posts
// @route   GET /api/blog/public
// @access  Public
export const getBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await BlogPost.find({ status: 'published' })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(posts.map(formatPostResponse));
});

// @desc    Get a single blog post by slug
// @route   GET /api/blog/public/:slug
// @access  Public
export const getBlogPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
    .populate('author', 'name email');

  if (post) {
    res.status(200).json(formatPostResponse(post));
  } else {
    res.status(404);
    throw new Error('Blog post not found');
  }
});

// @desc    Get a single blog post by ID
// @route   GET /api/blog/:id
// @access  Private/Admin
export const getBlogPostById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id)
    .populate('author', 'name email');

  if (post) {
    res.status(200).json(formatPostResponse(post));
  } else {
    res.status(404);
    throw new Error('Blog post not found');
  }
});

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.status = req.body.status || post.status;
  post.tags = req.body.tags || post.tags;
  post.featuredImage = req.body.featuredImage || post.featuredImage;
  post.metaTitle = req.body.metaTitle || post.metaTitle;
  post.metaDescription = req.body.metaDescription || post.metaDescription;
  post.excerpt = req.body.excerpt || post.excerpt;
  post.category = req.body.category || post.category;
  post.readTime = req.body.readTime || post.readTime;

  const updatedPost = await post.save();
  const populatedPost = await updatedPost.populate('author', 'name email');

  res.status(200).json(formatPostResponse(populatedPost));
});

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  await post.deleteOne();
  res.status(200).json({ message: 'Blog post removed' });
});

// @desc    Publish a blog post
// @route   PATCH /api/blog/:id/publish
// @access  Private/Admin
export const publishBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  post.status = 'published';
  post.publishedAt = new Date();
  const updatedPost = await post.save();
  const populatedPost = await updatedPost.populate('author', 'name email');

  res.status(200).json(formatPostResponse(populatedPost));
});

// @desc    Unpublish a blog post
// @route   PATCH /api/blog/:id/unpublish
// @access  Private/Admin
export const unpublishBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  post.status = 'draft';
  post.publishedAt = undefined;
  const updatedPost = await post.save();
  const populatedPost = await updatedPost.populate('author', 'name email');

  res.status(200).json(formatPostResponse(populatedPost));
});

// @desc    Archive a blog post
// @route   PATCH /api/blog/:id/archive
// @access  Private/Admin
export const archiveBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  post.status = 'archived';
  const updatedPost = await post.save();
  const populatedPost = await updatedPost.populate('author', 'name email');

  res.status(200).json(formatPostResponse(populatedPost));
});

// @desc    Unarchive a blog post
// @route   PATCH /api/blog/:id/unarchive
// @access  Private/Admin
export const unarchiveBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  post.status = 'draft';
  const updatedPost = await post.save();
  const populatedPost = await updatedPost.populate('author', 'name email');

  res.status(200).json(formatPostResponse(populatedPost));
});

// @desc    Increment views for a blog post
// @route   PATCH /api/blog/public/:id/views
// @access  Public
export const incrementViews = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (post.status !== 'published') {
    res.status(404);
    throw new Error('Blog post not found');
  }

  post.views += 1;
  await post.save();
  res.status(200).json({ views: post.views });
});

// @desc    Increment likes for a blog post
// @route   PATCH /api/blog/public/:id/likes
// @access  Public
export const incrementLikes = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (post.status !== 'published') {
    res.status(404);
    throw new Error('Blog post not found');
  }

  post.likes += 1;
  await post.save();
  res.status(200).json({ likes: post.likes });
});

// @desc    Get blog posts by category
// @route   GET /api/blog/public/category/:category
// @access  Public
export const getBlogPostsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const posts = await BlogPost.find({ 
    status: 'published', 
    category: req.params.category 
  })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(posts.map(formatPostResponse));
});
