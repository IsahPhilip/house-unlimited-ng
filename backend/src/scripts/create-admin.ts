import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDB } from '../config/database.js';
import { logger } from '../utils/logger.js';
import User from '../models/mongodb/User.mongoose.js';

const ADMIN_EMAIL = 'official@houseunlimitednigeria.com';
const ADMIN_PASSWORD = 'House1515*';
const ADMIN_NAME = 'House Unlimited Admin';

const run = async (): Promise<void> => {
  await connectDB();

  const existing = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

  if (existing) {
    existing.name = ADMIN_NAME;
    existing.password = ADMIN_PASSWORD;
    existing.role = 'admin';
    existing.isEmailVerified = true;
    await existing.save();
    logger.info(`Admin updated: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      isEmailVerified: true,
    });
    logger.info(`Admin created: ${ADMIN_EMAIL}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (error) => {
  logger.error('Create admin failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
