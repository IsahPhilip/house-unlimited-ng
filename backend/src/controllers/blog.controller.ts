import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { BlogPost, IBlogPost } from '../models/mongodb/BlogPost.mongoose.js';
import { BlogComment, IBlogComment } from '../models/mongodb/BlogComment.mongoose.js';
import { BlogLike } from '../models/mongodb/BlogLike.mongoose.js';
import { BlogBookmark } from '../models/mongodb/BlogBookmark.mongoose.js';

// Type guard to check if author is populated.
// A populated author will be an object with at least _id, name, and email.
const isAuthorPopulated = (
  author: any
): author is { _id: mongoose.Types.ObjectId; name: string; email: string; role?: string; avatar?: string; bio?: string; authorRole?: string } => {
  return author instanceof Object && '_id' in author && 'name' in author && 'email' in author;
};

// Centralized function to format blog post for API responses
export const formatPostResponse = (post: IBlogPost) => {
  const author = isAuthorPopulated(post.author)
    ? {
        id: post.author._id.toString(),
        name: post.author.name,
        email: post.author.email,
        role: post.author.authorRole || post.author.role,
        avatar: post.author.avatar,
        bio: post.author.bio,
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

const isUserPopulated = (
  user: any
): user is { _id: mongoose.Types.ObjectId; name: string; avatar?: string; role?: string; authorRole?: string } => {
  return user instanceof Object && '_id' in user && 'name' in user;
};

const formatCommentResponse = (comment: IBlogComment) => {
  const user = isUserPopulated(comment.user)
    ? {
        id: comment.user._id.toString(),
        name: comment.user.name,
        avatar: comment.user.avatar,
        role: comment.user.authorRole || comment.user.role,
      }
    : null;

  return {
    id: comment._id.toString(),
    content: comment.content,
    user,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

const ensurePublishedPost = async (id: string) => {
  return BlogPost.findOne({ _id: id, status: 'published' });
};

// @desc    Create a new blog post
// @route   POST /api/blog
// @access  Private/Admin
export const createBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, status, tags, featuredImage, metaTitle, metaDescription, excerpt, category, readTime } = req.body;

  if (!title || !content || !excerpt || !category) {
    res.status(400);
    throw new Error('Title, content, excerpt, and category are required');
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
    ...(readTime ? { readTime } : {}),
  });

  const createdPost = await blogPost.save();
  const populatedPost = await createdPost.populate('author', 'name email role authorRole avatar bio');

  res.status(201).json(formatPostResponse(populatedPost));
});

// @desc    Get all published blog posts
// @route   GET /api/blog/public
// @access  Public
export const getBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const query = { status: 'published' };

  const count = await BlogPost.countDocuments(query);
  const posts = await BlogPost.find(query)
    .populate('author', 'name email role authorRole avatar bio')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    posts: posts.map(formatPostResponse),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalPosts: count,
      limit,
    },
  });
});

// @desc    Get a single blog post by slug
// @route   GET /api/blog/public/:slug
// @access  Public
export const getBlogPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
    .populate('author', 'name email role authorRole avatar bio');

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
    .populate('author', 'name email role authorRole avatar bio');

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

  if (req.body.title !== undefined) post.title = req.body.title;
  if (req.body.content !== undefined) post.content = req.body.content;
  if (req.body.status !== undefined) post.status = req.body.status;
  if (req.body.tags !== undefined) post.tags = req.body.tags;
  if (req.body.featuredImage !== undefined) post.featuredImage = req.body.featuredImage;
  if (req.body.metaTitle !== undefined) post.metaTitle = req.body.metaTitle;
  if (req.body.metaDescription !== undefined) post.metaDescription = req.body.metaDescription;
  if (req.body.excerpt !== undefined) post.excerpt = req.body.excerpt;
  if (req.body.category !== undefined) post.category = req.body.category;
  if (req.body.readTime !== undefined) post.readTime = req.body.readTime;

  const updatedPost = await post.save();
  const populatedPost = await updatedPost.populate('author', 'name email role authorRole avatar bio');

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
  const populatedPost = await updatedPost.populate('author', 'name email role authorRole avatar bio');

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
  const populatedPost = await updatedPost.populate('author', 'name email role authorRole avatar bio');

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
  const populatedPost = await updatedPost.populate('author', 'name email role authorRole avatar bio');

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
  const populatedPost = await updatedPost.populate('author', 'name email role authorRole avatar bio');

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
    .populate('author', 'name email role authorRole avatar bio')
    .sort({ createdAt: -1 });

  res.status(200).json(posts.map(formatPostResponse));
});

// @desc    Get a single published blog post by ID
// @route   GET /api/blog/public/:id
// @access  Public
export const getPublicBlogPostById = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({ _id: req.params.id, status: 'published' })
    .populate('author', 'name email role authorRole avatar bio');

  if (post) {
    res.status(200).json(formatPostResponse(post));
  } else {
    res.status(404);
    throw new Error('Blog post not found');
  }
});

// @desc    Get all blog posts (admin)
// @route   GET /api/blog
// @access  Private/Admin
export const getAdminBlogPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name email role authorRole avatar bio');

  res.status(200).json(posts.map(formatPostResponse));
});

// @desc    Get related blog posts by tag/category similarity
// @route   GET /api/blog/public/:id/related
// @access  Public
export const getRelatedBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 3, 12);
  const basePost = await BlogPost.findOne({ _id: req.params.id, status: 'published' });

  if (!basePost) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const tags = basePost.tags || [];
  let relatedPosts;

  if (tags.length > 0) {
    relatedPosts = await BlogPost.aggregate([
      {
        $match: {
          status: 'published',
          _id: { $ne: basePost._id },
        },
      },
      {
        $addFields: {
          tagOverlap: {
            $size: { $setIntersection: ['$tags', tags] },
          },
          categoryMatch: {
            $cond: [{ $eq: ['$category', basePost.category] }, 1, 0],
          },
        },
      },
      {
        $addFields: {
          score: { $add: ['$tagOverlap', { $multiply: ['$categoryMatch', 0.5] }] },
        },
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $limit: limit },
    ]);
  } else {
    relatedPosts = await BlogPost.find({
      status: 'published',
      _id: { $ne: basePost._id },
      category: basePost.category,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  const populated = await BlogPost.populate(relatedPosts, {
    path: 'author',
    select: 'name email role authorRole avatar bio',
  });

  const populatedPosts = Array.isArray(populated)
    ? populated
    : [populated];

  res.status(200).json(populatedPosts.map((post) => formatPostResponse(post as IBlogPost)));
});

// @desc    Get comments for a blog post
// @route   GET /api/blog/public/:id/comments
// @access  Public
export const getBlogComments = asyncHandler(async (req: Request, res: Response) => {
  const post = await ensurePublishedPost(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const comments = await BlogComment.find({ post: post._id, status: 'visible' })
    .populate('user', 'name avatar role authorRole')
    .sort({ createdAt: -1 });

  res.status(200).json(comments.map(formatCommentResponse));
});

// @desc    Add a comment to a blog post
// @route   POST /api/blog/public/:id/comments
// @access  Private
export const addBlogComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content } = req.body;

  if (!content || !String(content).trim()) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  const post = await ensurePublishedPost(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const comment = await BlogComment.create({
    post: post._id,
    user: req.user!._id,
    content: String(content).trim(),
    status: 'visible',
  });

  await BlogPost.updateOne({ _id: post._id }, { $inc: { commentsCount: 1 } });

  const populated = await comment.populate('user', 'name avatar role authorRole');

  res.status(201).json(formatCommentResponse(populated));
});

// @desc    Update a blog comment
// @route   PUT /api/blog/public/comments/:commentId
// @access  Private
export const updateBlogComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content } = req.body;

  if (!content || !String(content).trim()) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  const comment = await BlogComment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const isOwner = comment.user.toString() === req.user!._id.toString();
  const isAdmin = req.user?.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Forbidden');
  }

  comment.content = String(content).trim();
  const updated = await comment.save();
  const populated = await updated.populate('user', 'name avatar role authorRole');

  res.status(200).json(formatCommentResponse(populated));
});

// @desc    Delete a blog comment
// @route   DELETE /api/blog/public/comments/:commentId
// @access  Private
export const deleteBlogComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const comment = await BlogComment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const isOwner = comment.user.toString() === req.user!._id.toString();
  const isAdmin = req.user?.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Forbidden');
  }

  const postId = comment.post.toString();
  const wasVisible = comment.status !== 'hidden';
  await comment.deleteOne();
  if (wasVisible) {
    await BlogPost.updateOne({ _id: postId }, { $inc: { commentsCount: -1 } });
    await BlogPost.updateOne({ _id: postId, commentsCount: { $lt: 0 } }, { $set: { commentsCount: 0 } });
  }

  res.status(200).json({ message: 'Comment removed' });
});

// @desc    Like a blog post
// @route   POST /api/blog/public/:id/like
// @access  Private
export const likeBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await ensurePublishedPost(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const existing = await BlogLike.findOne({ post: post._id, user: req.user!._id });

  if (existing) {
    res.status(200).json({ liked: true, likes: post.likes });
    return;
  }

  await BlogLike.create({ post: post._id, user: req.user!._id });
  const updated = await BlogPost.findByIdAndUpdate(
    post._id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  res.status(200).json({ liked: true, likes: updated?.likes ?? post.likes + 1 });
});

// @desc    Unlike a blog post
// @route   DELETE /api/blog/public/:id/like
// @access  Private
export const unlikeBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await ensurePublishedPost(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const existing = await BlogLike.findOne({ post: post._id, user: req.user!._id });

  if (!existing) {
    res.status(200).json({ liked: false, likes: post.likes });
    return;
  }

  await existing.deleteOne();
  const updated = await BlogPost.findByIdAndUpdate(
    post._id,
    { $inc: { likes: -1 } },
    { new: true }
  );
  await BlogPost.updateOne({ _id: post._id, likes: { $lt: 0 } }, { $set: { likes: 0 } });

  res.status(200).json({ liked: false, likes: updated?.likes ?? Math.max(0, post.likes - 1) });
});

// @desc    Bookmark a blog post
// @route   POST /api/blog/public/:id/bookmark
// @access  Private
export const bookmarkBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await ensurePublishedPost(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const existing = await BlogBookmark.findOne({ post: post._id, user: req.user!._id });

  if (existing) {
    res.status(200).json({ bookmarked: true });
    return;
  }

  await BlogBookmark.create({ post: post._id, user: req.user!._id });
  res.status(200).json({ bookmarked: true });
});

// @desc    Remove bookmark from a blog post
// @route   DELETE /api/blog/public/:id/bookmark
// @access  Private
export const unbookmarkBlogPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await ensurePublishedPost(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const existing = await BlogBookmark.findOne({ post: post._id, user: req.user!._id });

  if (!existing) {
    res.status(200).json({ bookmarked: false });
    return;
  }

  await existing.deleteOne();
  res.status(200).json({ bookmarked: false });
});

// @desc    Get interaction state for a blog post
// @route   GET /api/blog/public/:id/interaction
// @access  Private
export const getBlogInteraction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await ensurePublishedPost(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  const [liked, bookmarked] = await Promise.all([
    BlogLike.exists({ post: post._id, user: req.user!._id }),
    BlogBookmark.exists({ post: post._id, user: req.user!._id }),
  ]);

  res.status(200).json({
    liked: Boolean(liked),
    bookmarked: Boolean(bookmarked),
  });
});

// @desc    Get bookmarked posts for current user
// @route   GET /api/blog/public/bookmarks
// @access  Private
export const getBookmarkedPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookmarks = await BlogBookmark.find({ user: req.user!._id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'post',
      match: { status: 'published' },
      populate: { path: 'author', select: 'name email role authorRole avatar bio' },
    });

  const posts = bookmarks
    .map((bookmark) => bookmark.post)
    .filter((post) => post)
    .map((post) => formatPostResponse(post as IBlogPost));

  res.status(200).json(posts);
});
