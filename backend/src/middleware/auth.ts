import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    
    // Ensure decoded is an object (JwtPayload) and has the expected user properties
    if (typeof decoded === 'object' && decoded && 'id' in decoded && 'email' in decoded && 'name' in decoded) {
      req.user = {
        id: decoded.id as number,
        email: decoded.email as string,
        name: decoded.name as string,
      };
      next();
    } else {
      return res.status(403).json({ error: 'Invalid token payload' });
    }
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};