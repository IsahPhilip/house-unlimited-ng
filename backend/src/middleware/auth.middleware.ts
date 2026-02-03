import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/mongodb/User.mongoose.js';

// Extend Express Request interface to include user property
export interface AuthRequest extends Request {
  user?: IUser;
}

// Middleware to protect routes by verifying JWT
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Check for token in Authorization header (e.g., "Bearer <token>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      // Get user from the token and attach to request object, excluding the password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Middleware to grant access only to users with the 'admin' role
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: User is not an admin' });
  }
};