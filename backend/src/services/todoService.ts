import { query } from '../utils/database';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

export const getAllTodos = async (userId: number): Promise<Todo[]> => {
  const result = await query(
    'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export const getTodoById = async (todoId: number, userId: number): Promise<Todo | null> => {
  const result = await query(
    'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
    [todoId, userId]
  );
  return result.rows[0] || null;
};

export const createTodo = async (todoData: CreateTodoRequest, userId: number): Promise<Todo> => {
  const { title, description, priority = 'medium', due_date } = todoData;
  
  const result = await query(
    `INSERT INTO todos (user_id, title, description, priority, due_date) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [userId, title, description, priority, due_date]
  );
  
  return result.rows[0];
};

export const updateTodo = async (todoId: number, userId: number, updates: UpdateTodoRequest): Promise<Todo | null> => {
  const todo = await getTodoById(todoId, userId);
  if (!todo) {
    throw new Error('Todo not found');
  }

  const updateFields: string[] = [];
  const updateValues: any[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    updateFields.push(`title = $${paramIndex++}`);
    updateValues.push(updates.title);
  }
  
  if (updates.description !== undefined) {
    updateFields.push(`description = $${paramIndex++}`);
    updateValues.push(updates.description);
  }
  
  if (updates.completed !== undefined) {
    updateFields.push(`completed = $${paramIndex++}`);
    updateValues.push(updates.completed);
  }
  
  if (updates.priority !== undefined) {
    updateFields.push(`priority = $${paramIndex++}`);
    updateValues.push(updates.priority);
  }
  
  if (updates.due_date !== undefined) {
    updateFields.push(`due_date = $${paramIndex++}`);
    updateValues.push(updates.due_date);
  }

  if (updateFields.length === 0) {
    return todo;
  }

  updateValues.push(todoId, userId);
  
  const result = await query(
    `UPDATE todos SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} 
     RETURNING *`,
    updateValues
  );

  return result.rows[0];
};

export const deleteTodo = async (todoId: number, userId: number): Promise<boolean> => {
  const result = await query(
    'DELETE FROM todos WHERE id = $1 AND user_id = $2',
    [todoId, userId]
  );
  
  return result.rowCount > 0;
};

export const toggleTodoCompletion = async (todoId: number, userId: number): Promise<Todo | null> => {
  const result = await query(
    `UPDATE todos SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1 AND user_id = $2 
     RETURNING *`,
    [todoId, userId]
  );
  
  return result.rows[0] || null;
};