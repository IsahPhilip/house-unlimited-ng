import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: 'user' | 'agent' | 'admin';
  joinDate: Date;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    favoritePropertyTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
  getEmailVerificationToken(): string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio can not be more than 500 characters'],
    },
    location: {
      type: String,
      maxlength: [100, 'Location can not be more than 100 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      favoritePropertyTypes: [{
        type: String,
        enum: ['apartment', 'house', 'condo', 'townhouse', 'land', 'commercial'],
      }],
      priceRange: {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 10000000,
        },
      },
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return;
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (): string {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  // Convert expiresIn to number of seconds for JWT
  const expiresInSeconds = typeof expiresIn === 'string' && expiresIn.match(/^\d+d$/)
    ? parseInt(expiresIn) * 24 * 60 * 60
    : typeof expiresIn === 'string' && expiresIn.match(/^\d+h$/)
    ? parseInt(expiresIn) * 60 * 60
    : typeof expiresIn === 'string' && expiresIn.match(/^\d+m$/)
    ? parseInt(expiresIn) * 60
    : typeof expiresIn === 'string' && expiresIn.match(/^\d+s$/)
    ? parseInt(expiresIn)
    : 7 * 24 * 60 * 60; // Default to 7 days in seconds

  return jwt.sign(
    { id: this._id },
    secret,
    {
      expiresIn: expiresInSeconds,
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function (): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function (): string {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return verificationToken;
};

// Cascade delete reviews when a user is deleted
UserSchema.pre('deleteOne', { document: true, query: false }, async function (this: IUser) {
  console.log(`Reviews being removed from user ${this._id}`);
  const ReviewModel = mongoose.model('Review');
  await ReviewModel.deleteMany({ user: this._id });
});

// Reverse populate with virtuals
UserSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

export default mongoose.model<IUser>('User', UserSchema);
