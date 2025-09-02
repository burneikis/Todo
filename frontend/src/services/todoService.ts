import { api } from './api';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response = await api.get('/todos');
    return response.data;
  },

  async getTodo(id: number): Promise<Todo> {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  async updateTodo(id: number, updates: UpdateTodoRequest): Promise<Todo> {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  async toggleTodo(id: number): Promise<Todo> {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },
};