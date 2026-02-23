import mongoose from 'mongoose';
import { defaultSiteContent } from '../constants/siteContent.js';

const adminSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      default: 'House Unlimited Nigeria',
      maxlength: 200,
    },
    companyEmail: {
      type: String,
      default: 'official@houseunlimitednigeria.com',
      maxlength: 200,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    },
    companyPhone: {
      type: String,
      default: '+234 904 375 2708',
      maxlength: 50,
      match: [/^[+]?[\d\s().-]{7,50}$/, 'Please enter a valid phone number'],
    },
    timezone: {
      type: String,
      default: 'Africa/Lagos',
      enum: ['UTC', 'EST', 'PST', 'GMT', 'Africa/Lagos'],
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY',
      enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
    },
    currency: {
      type: String,
      default: 'NGN',
      enum: ['USD', 'EUR', 'GBP', 'NGN'],
    },
    mediaGallery: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          default: 'image',
        },
        title: {
          type: String,
          default: '',
          maxlength: 200,
        },
        url: {
          type: String,
          default: '',
        },
      },
    ],
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
    siteContent: {
      type: mongoose.Schema.Types.Mixed,
      default: defaultSiteContent,
    },
  },
  {
    timestamps: true,
  }
);

const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);

export default AdminSettings;
