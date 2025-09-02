import pool from '../utils/database';
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
  async getCategories(userId: number): Promise<Category[]> {
    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async getCategoryById(id: number, userId: number): Promise<Category | null> {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0] || null;
  },

  async createCategory(userId: number, categoryData: CreateCategoryRequest): Promise<Category> {
    const { name, color = '#3b82f6' } = categoryData;
    
    const result = await pool.query(
      'INSERT INTO categories (user_id, name, color) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, color]
    );
    
    return result.rows[0];
  },

  async updateCategory(id: number, userId: number, updates: UpdateCategoryRequest): Promise<Category | null> {
    const category = await this.getCategoryById(id, userId);
    if (!category) return null;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }

    if (updates.color !== undefined) {
      updateFields.push(`color = $${paramCount++}`);
      values.push(updates.color);
    }

    if (updateFields.length === 0) return category;

    values.push(id, userId);
    const result = await pool.query(
      `UPDATE categories SET ${updateFields.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount++} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async deleteCategory(id: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rowCount > 0;
  },

  async getTodoCategoriesByTodoId(todoId: number, userId: number): Promise<Category[]> {
    const result = await pool.query(`
      SELECT c.* FROM categories c
      JOIN todo_categories tc ON c.id = tc.category_id
      JOIN todos t ON tc.todo_id = t.id
      WHERE t.id = $1 AND t.user_id = $2
    `, [todoId, userId]);
    return result.rows;
  },

  async addTodoToCategory(todoId: number, categoryId: number, userId: number): Promise<boolean> {
    try {
      await pool.query(`
        INSERT INTO todo_categories (todo_id, category_id)
        SELECT $1, $2
        WHERE EXISTS (SELECT 1 FROM todos WHERE id = $1 AND user_id = $3)
        AND EXISTS (SELECT 1 FROM categories WHERE id = $2 AND user_id = $3)
        ON CONFLICT (todo_id, category_id) DO NOTHING
      `, [todoId, categoryId, userId]);
      return true;
    } catch (error) {
      return false;
    }
  },

  async removeTodoFromCategory(todoId: number, categoryId: number, userId: number): Promise<boolean> {
    const result = await pool.query(`
      DELETE FROM todo_categories
      WHERE todo_id = $1 AND category_id = $2
      AND EXISTS (SELECT 1 FROM todos WHERE id = $1 AND user_id = $3)
      AND EXISTS (SELECT 1 FROM categories WHERE id = $2 AND user_id = $3)
    `, [todoId, categoryId, userId]);
    return result.rowCount > 0;
  }
};