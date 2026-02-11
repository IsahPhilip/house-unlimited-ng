import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogLike extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blogLikeSchema = new Schema<IBlogLike>(
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

blogLikeSchema.index({ post: 1, user: 1 }, { unique: true });

export const BlogLike = mongoose.model<IBlogLike>('BlogLike', blogLikeSchema);
