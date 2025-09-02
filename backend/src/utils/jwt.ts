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

export const verifyToken = (token: string): any => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};