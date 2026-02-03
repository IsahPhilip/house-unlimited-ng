import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      default: 'Real Estate Platform',
      maxlength: 200,
    },
    companyEmail: {
      type: String,
      default: 'info@realestate.com',
      maxlength: 200,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    },
    companyPhone: {
      type: String,
      default: '+1 (555) 123-4567',
      maxlength: 50,
      match: [/^[+]?[\d\s().-]{7,50}$/, 'Please enter a valid phone number'],
    },
    timezone: {
      type: String,
      default: 'UTC',
      enum: ['UTC', 'EST', 'PST', 'GMT'],
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY',
      enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'NGN'],
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    security: {
      twoFactorAuth: { type: Boolean, default: false },
      sessionTimeout: { type: Number, default: 60 },
      passwordExpiry: { type: Number, default: 90 },
    },
  },
  {
    timestamps: true,
  }
);

const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);

export default AdminSettings;
