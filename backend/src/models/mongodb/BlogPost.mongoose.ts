import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthor {
  _id: string;
  name: string;
  email: string;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  readTime: number;
  author: mongoose.Types.ObjectId | IAuthor;
  views: number;
  likes: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
}

const blogPostSchema = new Schema<IBlogPost>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  featuredImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Real Estate', 'Market Trends', 'Home Buying', 'Home Selling', 'Investment', 'Property Management', 'Architecture', 'Interior Design', 'Finance', 'Lifestyle'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  readTime: {
    type: Number,
    required: [true, 'Read time is required'],
    min: [1, 'Read time must be at least 1 minute'],
    max: [120, 'Read time cannot be more than 120 minutes']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
blogPostSchema.index({ status: 1, createdAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ slug: 1 }, { unique: true });

// Pre-save middleware to generate slug from title and calculate read time
blogPostSchema.pre('save', function(next: (err?: Error) => void) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (this.isModified('content') || this.isNew) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }

  next();
});

// Static method to find published posts
blogPostSchema.statics.findPublished = function() {
  return this.find({ status: 'published' }).sort({ createdAt: -1 });
};

// Static method to find by category
blogPostSchema.statics.findByCategory = function(category: string) {
  return this.find({ 
    status: 'published', 
    category 
  }).sort({ createdAt: -1 });
};

// Instance method to increment views
blogPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment likes
blogPostSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Instance method to increment comments count
blogPostSchema.methods.incrementComments = function() {
  this.commentsCount += 1;
  return this.save();
};

// Instance method to publish post
blogPostSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

// Instance method to unpublish post
blogPostSchema.methods.unpublish = function() {
  this.status = 'draft';
  this.publishedAt = undefined;
  return this.save();
};

// Instance method to archive post
blogPostSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Instance method to unarchive post
blogPostSchema.methods.unarchive = function() {
  this.status = 'draft';
  return this.save();
};

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);