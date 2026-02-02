import mongoose from 'mongoose';
import User from '../models/mongodb/User.mongoose.js';

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/house-unlimited');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
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
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();