import { Request, Response } from 'express';
import Newsletter from '../models/Newsletter.js';
import { sendNewsletterWelcomeEmail } from '../services/emailService.js';

// Subscribe to newsletter
export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Check if email is already subscribed
    const existingSubscriber = await Newsletter.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });
    
    if (existingSubscriber) {
      res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter.'
      });
      return;
    }

    // Create new newsletter subscriber
    const newsletter = new Newsletter({
      email: email.toLowerCase().trim()
    });

    await newsletter.save();

    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email, newsletter._id.toString());
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email: newsletter.email,
        subscribedAt: newsletter.subscribedAt
      }
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter.'
      });
      return;
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Invalid email address',
        errors: messages
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get all newsletter subscribers (admin only)
export const getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await Newsletter.find({ isActive: true })
      .select('email subscribedAt')
      .sort({ subscribedAt: -1 });

    res.json({
      success: true,
      data: subscribers,
      count: subscribers.length
    });
  } catch (error) {
    console.error('Get newsletter subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Unsubscribe from newsletter
export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter subscribers.'
      });
      return;
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter.'
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get subscriber count (admin only)
export const getSubscriberCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Newsletter.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get newsletter count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};
