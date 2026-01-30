import { Request, Response, NextFunction } from 'express';
import Property from '../models/mongodb/Property.mongoose.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const startIndex = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by city
    if (req.query.city) {
      query.city = new RegExp(req.query.city as string, 'i');
    }

    // Filter by state
    if (req.query.state) {
      query.state = new RegExp(req.query.state as string, 'i');
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.priceValue = {};
      if (req.query.minPrice) {
        query.priceValue.$gte = parseInt(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.priceValue.$lte = parseInt(req.query.maxPrice as string);
      }
    }

    // Text search
    if (req.query.search) {
      query.$text = { $search: req.query.search as string };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Execute query
    const properties = await Property.find(query)
      .populate('agent', 'name email phone avatar')
      .sort([
        ['featured', -1],
        ['createdAt', -1]
      ])
      .limit(limit)
      .skip(startIndex);

    // Get total count for pagination
    const total = await Property.countDocuments(query);

    // Pagination info
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProperties: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone avatar')
      .populate('reviews');

    if (!property) {
      res.status(404).json({
        success: false,
        error: 'Property not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Agent/Admin only)
export const createProperty = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Add agent to req.body
    req.body.agent = req.user._id;

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Agent/Admin only)
export const updateProperty = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({
        success: false,
        error: 'Property not found',
      });
      return;
    }

    // Make sure user is property agent or admin
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to update this property',
      });
      return;
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Agent/Admin only)
export const deleteProperty = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({
        success: false,
        error: 'Property not found',
      });
      return;
    }

    // Make sure user is property agent or admin
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Not authorized to delete this property',
      });
      return;
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const properties = await Property.find({ featured: true, status: 'available' })
      .populate('agent', 'name email avatar')
      .sort([['createdAt', -1]])
      .limit(6);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search properties
// @route   GET /api/properties/search
// @access  Public
export const searchProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, location, type, category, minPrice, maxPrice } = req.query;

    let query: any = { status: 'available' };

    // Text search
    if (q) {
      query.$text = { $search: q as string };
    }

    // Location search
    if (location) {
      query.$or = [
        { city: new RegExp(location as string, 'i') },
        { state: new RegExp(location as string, 'i') },
        { address: new RegExp(location as string, 'i') },
      ];
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.priceValue = {};
      if (minPrice) query.priceValue.$gte = parseInt(minPrice as string);
      if (maxPrice) query.priceValue.$lte = parseInt(maxPrice as string);
    }

    const properties = await Property.find(query)
      .populate('agent', 'name email avatar')
      .sort([
        ['featured', -1],
        ['createdAt', -1]
      ])
      .limit(50);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties by location
// @route   GET /api/properties/location/:location
// @access  Public
export const getPropertiesByLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { location } = req.params;

    const properties = await Property.find({
      status: 'available',
      $or: [
        { city: { $regex: location || '', $options: 'i' } },
        { state: { $regex: location || '', $options: 'i' } },
      ],
    })
      .populate('agent', 'name email avatar')
      .sort([
        ['featured', -1],
        ['createdAt', -1]
      ])
      .limit(20);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};
