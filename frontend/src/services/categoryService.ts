import { api } from './api';
import { Category } from '../types';

export interface CreateCategoryRequest {
  name: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCategory(id: number): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id: number, updates: UpdateCategoryRequest): Promise<Category> {
    const response = await api.put(`/categories/${id}`, updates);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  async addTodoToCategory(todoId: number, categoryId: number): Promise<void> {
    await api.post(`/categories/todos/${todoId}/categories/${categoryId}`);
  },

  async removeTodoFromCategory(todoId: number, categoryId: number): Promise<void> {
    await api.delete(`/categories/todos/${todoId}/categories/${categoryId}`);
  },
};