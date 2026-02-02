import { Request, Response } from 'express';
import Contact from '../models/Contact.js';
import { sendContactNotification, sendContactConfirmation } from '../services/emailService.js';

// Submit contact form
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message, phone, type } = req.body;

    // Create new contact submission
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      phone: phone?.trim(),
      type: type || 'general'
    });

    await contact.save();

    // Send notifications
    try {
      // Send notification to admin
      await sendContactNotification({
        name,
        email,
        subject,
        message,
        phone,
        type
      });

      // Send confirmation to user
      await sendContactConfirmation(email, name, contact._id.toString());
    } catch (emailError) {
      console.error('Failed to send contact emails:', emailError);
      // Don't fail the submission if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      data: {
        contactId: contact._id,
        submittedAt: contact.createdAt
      }
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Invalid form data',
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

// Get all contact submissions (admin only)
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const contacts = await Contact.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalContacts: total,
        hasNextPage: skip + Number(limit) < total,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get contact by ID (admin only)
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
      return;
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Update contact status (admin only)
export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, assignedTo } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
      return;
    }

    contact.status = status || contact.status;
    contact.assignedTo = assignedTo || contact.assignedTo;
    contact.respondedAt = status === 'resolved' ? new Date() : contact.respondedAt;

    await contact.save();

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Delete contact (admin only)
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
      return;
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get contact statistics (admin only)
export const getContactStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    const resolvedContacts = await Contact.countDocuments({ status: 'resolved' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in_progress' });

    const typeStats = await Contact.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const statusStats = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalContacts,
        pending: pendingContacts,
        resolved: resolvedContacts,
        inProgress: inProgressContacts,
        typeStats,
        statusStats
      }
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};