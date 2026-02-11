import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogComment extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  status: 'visible' | 'hidden';
  hiddenAt?: Date | null;
  hiddenBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const blogCommentSchema = new Schema<IBlogComment>(
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
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot be more than 2000 characters'],
    },
    status: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible',
      index: true,
    },
    hiddenAt: {
      type: Date,
      default: null,
    },
    hiddenBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

blogCommentSchema.index({ post: 1, createdAt: -1 });

export const BlogComment = mongoose.model<IBlogComment>('BlogComment', blogCommentSchema);
