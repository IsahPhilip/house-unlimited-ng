import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unsubscribedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for email to ensure uniqueness and improve query performance
newsletterSchema.index({ email: 1 });

// Static method to check if email already exists
newsletterSchema.statics.isEmailSubscribed = async function(email: string): Promise<boolean> {
  const existingSubscriber = await this.findOne({ email: email.toLowerCase() });
  return !!existingSubscriber && existingSubscriber.isActive;
};

// Instance method to unsubscribe
newsletterSchema.methods.unsubscribe = async function(): Promise<void> {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  await this.save();
};

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;