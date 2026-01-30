import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const connectDB = async (): Promise<void> => {
  try {
    // Use local MongoDB for testing (comment out if using Atlas)
    const mongoURI = 'mongodb://localhost:27017/real-estate-platform';
    // const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate-platform';
    
    await mongoose.connect(mongoURI);
    
    logger.info('MongoDB Connected');

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB connection disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

export { connectDB };