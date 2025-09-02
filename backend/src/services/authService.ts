import bcrypt from 'bcryptjs';
import { query } from '../utils/database';
import { generateToken } from '../utils/jwt';
import { User, RegisterRequest, LoginRequest } from '../types';

export const registerUser = async (userData: RegisterRequest): Promise<{ user: Omit<User, 'password_hash'>; token: string }> => {
  const { email, password, name } = userData;
  
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('User already exists with this email');
  }

  const saltRounds = 12;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const result = await query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at, updated_at',
    [email, password_hash, name]
  );

  const user = result.rows[0];
  const token = generateToken({ id: user.id, email: user.email, name: user.name });

  return { user, token };
};

export const loginUser = async (credentials: LoginRequest): Promise<{ user: Omit<User, 'password_hash'>; token: string }> => {
  const { email, password } = credentials;

  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ id: user.id, email: user.email, name: user.name });
  
  const { password_hash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};