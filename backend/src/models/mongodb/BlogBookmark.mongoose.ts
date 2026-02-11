import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogBookmark extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blogBookmarkSchema = new Schema<IBlogBookmark>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

blogBookmarkSchema.index({ post: 1, user: 1 }, { unique: true });

export const BlogBookmark = mongoose.model<IBlogBookmark>('BlogBookmark', blogBookmarkSchema);
