// c:\Users\hp\Documents\Code\house-unlimited-ng\backend\src\controllers\inquiryController.ts

import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry.js';

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId, name, email, message } = req.body;

    if (!propertyId || !name || !email || !message) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const inquiry = await Inquiry.create({
      propertyId,
      name,
      email,
      message,
    });

    res.status(201).json({ message: 'Inquiry sent successfully', inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiries = await Inquiry.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
