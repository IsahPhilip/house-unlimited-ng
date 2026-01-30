import { Table, Column, Model, DataType, HasMany, BeforeCreate, BeforeUpdate, BeforeDestroy } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true
})
export class User extends Model<User> {
  static countDocuments() {
    throw new Error('Method not implemented.');
  }
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  })
  name!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  })
  email!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100]
    }
  })
  password!: string;

  @Column({
    type: DataType.STRING(20),
    validate: {
      len: [0, 20]
    }
  })
  phone?: string;

  @Column({
    type: DataType.STRING(255)
  })
  avatar?: string;

  @Column({
    type: DataType.STRING(500),
    validate: {
      len: [0, 500]
    }
  })
  bio?: string;

  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [0, 100]
    }
  })
  location?: string;

  @Column({
    type: DataType.ENUM('user', 'agent', 'admin'),
    defaultValue: 'user'
  })
  role!: 'user' | 'agent' | 'admin';

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  joinDate!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isEmailVerified!: boolean;

  @Column({
    type: DataType.STRING
  })
  emailVerificationToken?: string;

  @Column({
    type: DataType.DATE
  })
  emailVerificationExpires?: Date;

  @Column({
    type: DataType.STRING
  })
  passwordResetToken?: string;

  @Column({
    type: DataType.DATE
  })
  passwordResetExpires?: Date;

  @Column({
    type: DataType.JSONB,
    defaultValue: {
      emailNotifications: true,
      smsNotifications: false,
      favoritePropertyTypes: [],
      priceRange: {
        min: 0,
        max: 10000000
      }
    }
  })
  preferences!: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    favoritePropertyTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };

  @Column({
    type: DataType.JSONB
  })
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  @Column({
    type: DataType.DATE
  })
  lastLogin?: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive!: boolean;

  @HasMany(() => Review, 'userId')
  reviews!: Review[];

  // Instance methods
  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  getSignedJwtToken(): string {
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
      { id: this.id },
      secret,
      {
        expiresIn: expiresInSeconds,
      }
    );
  }

  getResetPasswordToken(): string {
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
  }

  getEmailVerificationToken(): string {
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
  }

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    // Only run this function if password was actually modified
    if (instance.changed('password')) {
      // Hash password with cost of 12
      const salt = await bcrypt.genSalt(12);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  @BeforeDestroy
  static async cascadeDeleteReviews(instance: User) {
    console.log(`Reviews being removed from user ${instance.id}`);
    // This will be handled by the association with cascade option
  }
}

import { Review } from './Review.model';

export default User;
