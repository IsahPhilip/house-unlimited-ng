import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Upload file
// @route   POST /api/uploads
// @access  Private
export const uploadFile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }

    // File information
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `${process.env.FRONTEND_URL}/uploads/${req.file.filename}`,
    };

    res.status(200).json({
      success: true,
      data: fileInfo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/uploads/:publicId
// @access  Private
export const deleteFile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { publicId } = req.params;

    // For now, just return success
    // In a real implementation, you'd delete from cloud storage

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's uploaded files
// @route   GET /api/uploads
// @access  Private
export const getFiles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // For now, return empty array
    // In a real implementation, you'd fetch user's uploaded files

    res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  } catch (error) {
    next(error);
  }
};
