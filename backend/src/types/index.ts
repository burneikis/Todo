import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  categoryIds?: number[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  categoryIds?: number[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}