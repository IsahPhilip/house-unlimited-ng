import { Request, Response } from 'express';
import Blog from '../models/mongodb/Blog.mongoose.js';

// A basic error handler for async functions to avoid repeating try-catch blocks
const asyncHandler = (fn: (req: Request, res: Response, next: Function) => Promise<any>) =>
  (req: Request, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlogPost = asyncHandler(async (req: any, res: Response) => {
  const { title, content, status, tags, featuredImage, metaTitle, metaDescription } = req.body;

  // NOTE: Assuming user ID is available from an auth middleware on `req.user`
  // const author = req.user.id;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const blogPost = new Blog({
    title,
    content,
    author: req.user.id, // Replace with your actual user ID source
    status,
    tags,
    featuredImage,
    metaTitle,
    metaDescription
  });

  const createdPost = await blogPost.save();
  res.status(201).json(createdPost);
});

// @desc    Get all published blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Blog.find({ status: 'published' })
    .populate('author', 'name email') // Populate author with only name and email
    .sort({ createdAt: -1 }); // Sort by newest first

  res.status(200).json(posts);
});

// @desc    Get a single blog post by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await Blog.findOne({ slug: req.params.slug, status: 'published' })
    .populate('author', 'name email');

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('Blog post not found');
  }
});

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlogPost = asyncHandler(async (req: any, res: Response) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  // NOTE: Add authorization check here.
  // For example: if (post.author.toString() !== req.user.id && req.user.role !== 'admin') { ... }

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.status = req.body.status || post.status;
  post.tags = req.body.tags || post.tags;
  post.featuredImage = req.body.featuredImage || post.featuredImage;
  post.metaTitle = req.body.metaTitle || post.metaTitle;
  post.metaDescription = req.body.metaDescription || post.metaDescription;

  const updatedPost = await post.save();
  res.status(200).json(updatedPost);
});

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlogPost = asyncHandler(async (req: any, res: Response) => {
  const post = await Blog.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  // NOTE: Add authorization check here.

  await post.deleteOne();
  res.status(200).json({ message: 'Blog post removed' });
});