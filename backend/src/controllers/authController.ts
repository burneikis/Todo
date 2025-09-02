import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: RegisterRequest = req.body;
    
    if (!userData.email || !userData.password || !userData.name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (userData.password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const result = await registerUser(userData);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials: LoginRequest = req.body;
    
    if (!credentials.email || !credentials.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await loginUser(credentials);
    
    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    next(error);
  }
};