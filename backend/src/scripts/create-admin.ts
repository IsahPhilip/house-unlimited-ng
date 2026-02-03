import mongoose from 'mongoose';
import User from '../models/mongodb/User.mongoose.js';

// For loading environment variables from a .env file in development
import dotenv from 'dotenv';
dotenv.config();

async function createAdmin() {
  let exitCode = 0;
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/house-unlimited';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'official@houseunlimitednigeria.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      console.error('Error: ADMIN_PASSWORD environment variable is not set.');
      console.log('Please set it before running the script.');
      console.log('Example (PowerShell): $env:ADMIN_PASSWORD="your_secure_password"; npm run create-admin');
      console.log('Example (bash/zsh):   ADMIN_PASSWORD="your_secure_password" npm run create-admin');
      process.exit(1); // Exit immediately as we can't proceed
    }

    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to the database.');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
    } else {
      // Create admin user
      const admin = new User({
        name: 'House Unlimited Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD, // Your User model should handle hashing this password
        role: 'admin',
        isEmailVerified: true,
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          favoritePropertyTypes: [],
          priceRange: { min: 0, max: 10000000 }
        }
      });

      await admin.save();
      
      console.log('Admin user created successfully!');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Role: admin');
    }

  } catch (error) {
    console.error('Error creating admin:', error);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(exitCode);
  }
}

createAdmin();