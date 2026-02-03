import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  property: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  agent: mongoose.Types.ObjectId;
  offerPrice: number;
  acceptedPrice?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema<IDeal> = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Please add a property'],
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add a buyer'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add a seller'],
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add an agent'],
    },
    offerPrice: {
      type: Number,
      required: [true, 'Please add an offer price'],
      min: 0,
    },
    acceptedPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

DealSchema.index({ status: 1, createdAt: -1 });
DealSchema.index({ agent: 1, status: 1 });

export default mongoose.model<IDeal>('Deal', DealSchema);
