import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  title?: string;
  comment: string;
  rating: number;
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  agent: mongoose.Types.ObjectId;
  isVerifiedPurchase: boolean;
  helpful: number;
  reported: boolean;
  response?: {
    comment: string;
    respondedAt: Date;
    respondedBy: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    title: {
      type: String,
      maxlength: [100, 'Title can not be more than 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      maxlength: [1000, 'Comment can not be more than 1000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: 1,
      max: 5,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Please add a property reference'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add a user reference'],
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add an agent reference'],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    reported: {
      type: Boolean,
      default: false,
    },
    response: {
      comment: {
        type: String,
        maxlength: [1000, 'Response can not be more than 1000 characters'],
      },
      respondedAt: {
        type: Date,
        default: Date.now,
      },
      respondedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent user from submitting more than one review per property
ReviewSchema.index({ property: 1, user: 1 }, { unique: true });

// Add indexes for common queries
ReviewSchema.index({ property: 1, rating: -1 });
ReviewSchema.index({ user: 1, createdAt: -1 });
ReviewSchema.index({ agent: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1, createdAt: -1 });

// Static method to get average rating for a property
ReviewSchema.statics.getAverageRating = async function (propertyId: string) {
  const obj = await this.aggregate([
    {
      $match: { property: new mongoose.Types.ObjectId(propertyId) },
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    const PropertyModel = mongoose.model('Property');
    await PropertyModel.findByIdAndUpdate(propertyId, {
      averageRating: obj[0]?.averageRating || 0,
      reviewCount: obj[0]?.reviewCount || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
  (this.constructor as any).getAverageRating(this.property);
});

// Call getAverageRating after remove
ReviewSchema.post('deleteOne', { document: true, query: false }, function () {
  (this.constructor as any).getAverageRating(this.property);
});

// Reverse populate with virtuals
ReviewSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  select: 'name avatar',
});

ReviewSchema.virtual('propertyInfo', {
  ref: 'Property',
  localField: 'property',
  foreignField: '_id',
  justOne: true,
  select: 'title address featuredImage',
});

ReviewSchema.virtual('agentInfo', {
  ref: 'User',
  localField: 'agent',
  foreignField: '_id',
  justOne: true,
  select: 'name avatar role',
});

export default mongoose.model<IReview>('Review', ReviewSchema);
