import { Request, Response, NextFunction } from 'express';
import Review from '../models/mongodb/Review.mongoose.js';
import Property from '../models/mongodb/Property.mongoose.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find()
      .populate('user', 'name avatar')
      .populate('property', 'title address featuredImage')
      .sort([['createdAt', -1]])
      .limit(limit)
      .skip(startIndex);

    const total = await Review.countDocuments();

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('property', 'title address featuredImage');

    if (!review) {
      res.status(404).json({
        success: false,
        error: 'Review not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { propertyId, rating, comment, title } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({
        success: false,
        error: 'Property not found',
      });
      return;
    }

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (existingReview) {
      res.status(400).json({
        success: false,
        error: 'You have already reviewed this property',
      });
      return;
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      agent: property.agent,
      rating,
      comment,
      title,
      isVerifiedPurchase: false, // Could be determined by checking if user has purchased/rented
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .populate('property', 'title address featuredImage');

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Review owner or admin)
export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({
        success: false,
        error: 'Review not found',
      });
      return;
    }

    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to update this review',
      });
      return;
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name avatar')
      .populate('property', 'title address featuredImage');

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner or admin)
export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).json({
        success: false,
        error: 'Review not found',
      });
      return;
    }

    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to delete this review',
      });
      return;
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'name avatar')
      .populate('agent', 'name avatar role')
      .sort([['createdAt', -1]])
      .limit(limit)
      .skip(startIndex);

    const total = await Review.countDocuments({ property: propertyId });

    // Calculate average rating
    const allReviews = await Review.find({ property: propertyId });
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
      : 0;

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination,
      averageRating: averageRating,
      totalReviews: total,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's reviews
// @route   GET /api/reviews/user/me
// @access  Private
export const getUserReviews = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('property', 'title address featuredImage')
      .populate('agent', 'name avatar role')
      .sort([['createdAt', -1]]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
