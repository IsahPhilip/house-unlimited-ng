import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

// Interface for the Blog document
export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  featuredImage?: string;
  tags?: string[];
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      // Index for faster queries by slug
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Middleware to generate slug from title before saving
BlogSchema.pre<IBlog>('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;