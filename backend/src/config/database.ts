import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { mockDB } from './mockDatabase.js';

const connectDB = async (): Promise<void> => {
  try {
    // Try to connect to MongoDB first
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-platform';

    try {
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      };

      const conn = await mongoose.connect(mongoURI, options);

      // Get the actual connection host information
      const host = conn.connections[0]?.host || 'unknown';
      logger.info(`MongoDB Connected: ${host}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      });

    } catch (mongoError) {
      // If MongoDB connection fails, fall back to mock database
      logger.warn('MongoDB not available, using mock database for development');
      await mockDB.connect();

      // Set up graceful shutdown for mock database
      process.on('SIGINT', async () => {
        await mockDB.disconnect();
        logger.info('Mock Database connection closed through app termination');
        process.exit(0);
      });
    }

  } catch (error) {
    logger.error('Error connecting to database:', error);
    process.exit(1);
  }
};

// Seed mock database with sample data
const seedMockDatabase = async () => {
  try {
    // Add sample properties
    const sampleProperties = [
      {
        title: 'Riverview Retreat',
        price: '$6,000/month',
        priceValue: 6000,
        type: 'Apartment',
        category: 'rent',
        address: '6391 Elgin St. Celina, Delaware 10299',
        beds: 4,
        baths: 2,
        sqft: 2148,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        description: 'Experience luxury living in this spacious 4-bedroom apartment featuring stunning river views.',
        amenities: ['River View', 'Gourmet Kitchen', 'Parking', 'Gym', 'Balcony', 'Smart Home System'],
        coordinates: [39.7392, -104.9903],
        featured: true
      },
      {
        title: 'Sunset Vista Villa',
        price: '$396,000',
        priceValue: 396000,
        type: 'Villa',
        category: 'sale',
        address: '1901 Thornridge Cir., Hawaii 81063',
        beds: 2,
        baths: 1,
        sqft: 1148,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
        description: 'Escape to paradise in this charming Hawaiian villa with incredible sunset views.',
        amenities: ['Ocean View', 'Private Garden', 'Lanai', 'Outdoor Shower', 'Solar Panels'],
        coordinates: [21.3069, -157.8583],
        featured: true
      }
    ];

    for (const property of sampleProperties) {
      await mockDB.create('properties', property);
    }

    console.log('Mock database seeded with sample data');
  } catch (error) {
    console.error('Error seeding mock database:', error);
  }
};

// Call seed function after connection
connectDB().then(() => {
  // Only seed if using mock database
  if (process.env.MONGODB_URI) {
    console.log('Using MongoDB, skipping mock database seeding');
  } else {
    seedMockDatabase();
  }
});

export { connectDB, mockDB };
