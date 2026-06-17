import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin, isAuthEnabled } from '../config/firebase';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        phone?: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  if (!isAuthEnabled) {
    // Development/Mock Mode: Skip real verification if Firebase isn't configured
    console.warn('⚠️ Firebase not configured. Skipping auth verification for token:', token.substring(0, 10) + '...');
    req.user = { uid: 'mock-user-123', email: 'mock@example.com' };
    return next();
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      phone: decodedToken.phone_number
    };
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
