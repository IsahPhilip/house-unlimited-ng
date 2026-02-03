import mongoose from 'mongoose';

const adminNotificationSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      required: true,
      enum: ['contact', 'property'],
      index: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['new_lead', 'deal_update', 'appointment', 'property_update'],
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

adminNotificationSchema.index({ sourceType: 1, sourceId: 1 }, { unique: true });

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);

export default AdminNotification;
