import { Response, NextFunction } from 'express';
import { AuthRequest, CreateTodoRequest, UpdateTodoRequest } from '../types';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion
} from '../services/todoService';

export const getTodos = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const todos = await getAllTodos(userId);
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const getTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const todoId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }
    
    const todo = await getTodoById(todoId, userId);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

export const createNewTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const todoData: CreateTodoRequest = req.body;
    const userId = req.user!.id;
    
    if (!todoData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const todo = await createTodo(todoData, userId);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

export const updateExistingTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const todoId = parseInt(req.params.id);
    const userId = req.user!.id;
    const updates: UpdateTodoRequest = req.body;
    
    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }
    
    const todo = await updateTodo(todoId, userId, updates);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

export const deleteTodoById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const todoId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }
    
    const deleted = await deleteTodo(todoId, userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const toggleTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const todoId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }
    
    const todo = await toggleTodoCompletion(todoId, userId);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    next(error);
  }
};