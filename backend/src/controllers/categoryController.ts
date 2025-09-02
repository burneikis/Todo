import { Response } from 'express';
import { AuthRequest } from '../types';
import { categoryService, CreateCategoryRequest, UpdateCategoryRequest } from '../services/categoryService';

export const categoryController = {
  async getCategories(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const categories = await categoryService.getCategories(userId);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },

  async getCategoryById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const categoryId = parseInt(req.params.id);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      const category = await categoryService.getCategoryById(categoryId, userId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  },

  async createCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { name, color } = req.body as CreateCategoryRequest;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return res.status(400).json({ error: 'Color must be a valid hex color code' });
      }

      const category = await categoryService.createCategory(userId, {
        name: name.trim(),
        color
      });

      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  },

  async updateCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const categoryId = parseInt(req.params.id);
      const updates = req.body as UpdateCategoryRequest;

      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      if (updates.name !== undefined && updates.name.trim().length === 0) {
        return res.status(400).json({ error: 'Category name cannot be empty' });
      }

      if (updates.color && !/^#[0-9A-Fa-f]{6}$/.test(updates.color)) {
        return res.status(400).json({ error: 'Color must be a valid hex color code' });
      }

      const category = await categoryService.updateCategory(categoryId, userId, {
        ...updates,
        name: updates.name?.trim()
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  },

  async deleteCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const categoryId = parseInt(req.params.id);

      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      const success = await categoryService.deleteCategory(categoryId, userId);
      if (!success) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  },

  async addTodoToCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const todoId = parseInt(req.params.todoId);
      const categoryId = parseInt(req.params.categoryId);

      if (isNaN(todoId) || isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid todo ID or category ID' });
      }

      const success = await categoryService.addTodoToCategory(todoId, categoryId, userId);
      if (!success) {
        return res.status(404).json({ error: 'Todo or category not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error adding todo to category:', error);
      res.status(500).json({ error: 'Failed to add todo to category' });
    }
  },

  async removeTodoFromCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const todoId = parseInt(req.params.todoId);
      const categoryId = parseInt(req.params.categoryId);

      if (isNaN(todoId) || isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid todo ID or category ID' });
      }

      const success = await categoryService.removeTodoFromCategory(todoId, categoryId, userId);
      if (!success) {
        return res.status(404).json({ error: 'Todo or category not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error removing todo from category:', error);
      res.status(500).json({ error: 'Failed to remove todo from category' });
    }
  }
};