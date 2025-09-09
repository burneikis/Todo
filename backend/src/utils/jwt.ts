import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const generateToken = (payload: object): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token: string): jwt.JwtPayload | string | null => {
  return jwt.decode(token);
};