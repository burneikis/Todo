import { query } from '../utils/database';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

export const getAllTodos = async (userId: number): Promise<Todo[]> => {
  const todosResult = await query(
    'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  
  const todos = todosResult.rows;
  
  // Get categories for each todo
  for (const todo of todos) {
    const categoriesResult = await query(`
      SELECT c.* FROM categories c
      JOIN todo_categories tc ON c.id = tc.category_id
      WHERE tc.todo_id = $1
    `, [todo.id]);
    todo.categories = categoriesResult.rows;
  }
  
  return todos;
};

export const getTodoById = async (todoId: number, userId: number): Promise<Todo | null> => {
  const result = await query(
    'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
    [todoId, userId]
  );
  
  const todo = result.rows[0];
  if (!todo) return null;
  
  // Get categories for this todo
  const categoriesResult = await query(`
    SELECT c.* FROM categories c
    JOIN todo_categories tc ON c.id = tc.category_id
    WHERE tc.todo_id = $1
  `, [todo.id]);
  todo.categories = categoriesResult.rows;
  
  return todo;
};

export const createTodo = async (todoData: CreateTodoRequest, userId: number): Promise<Todo> => {
  const { title, description, priority = 'medium', due_date, categoryIds = [] } = todoData;
  
  const result = await query(
    `INSERT INTO todos (user_id, title, description, priority, due_date) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [userId, title, description, priority, due_date]
  );
  
  const todo = result.rows[0];
  
  // Add category associations if provided
  if (categoryIds.length > 0) {
    await updateTodoCategories(todo.id, categoryIds, userId);
  }
  
  // Get the complete todo with categories
  return await getTodoById(todo.id, userId) as Todo;
};

export const updateTodo = async (todoId: number, userId: number, updates: UpdateTodoRequest): Promise<Todo | null> => {
  const todo = await getTodoById(todoId, userId);
  if (!todo) {
    throw new Error('Todo not found');
  }

  const { categoryIds, ...todoUpdates } = updates;
  const updateFields: string[] = [];
  const updateValues: any[] = [];
  let paramIndex = 1;

  if (todoUpdates.title !== undefined) {
    updateFields.push(`title = $${paramIndex++}`);
    updateValues.push(todoUpdates.title);
  }
  
  if (todoUpdates.description !== undefined) {
    updateFields.push(`description = $${paramIndex++}`);
    updateValues.push(todoUpdates.description);
  }
  
  if (todoUpdates.completed !== undefined) {
    updateFields.push(`completed = $${paramIndex++}`);
    updateValues.push(todoUpdates.completed);
  }
  
  if (todoUpdates.priority !== undefined) {
    updateFields.push(`priority = $${paramIndex++}`);
    updateValues.push(todoUpdates.priority);
  }
  
  if (todoUpdates.due_date !== undefined) {
    updateFields.push(`due_date = $${paramIndex++}`);
    updateValues.push(todoUpdates.due_date);
  }

  // Update todo fields if there are any changes
  if (updateFields.length > 0) {
    updateValues.push(todoId, userId);
    
    await query(
      `UPDATE todos SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}`,
      updateValues
    );
  }

  // Update categories if provided
  if (categoryIds !== undefined) {
    await updateTodoCategories(todoId, categoryIds, userId);
  }

  // Return the updated todo with categories
  return await getTodoById(todoId, userId);
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
  
  const todo = result.rows[0];
  if (!todo) return null;
  
  // Get categories for this todo
  const categoriesResult = await query(`
    SELECT c.* FROM categories c
    JOIN todo_categories tc ON c.id = tc.category_id
    WHERE tc.todo_id = $1
  `, [todo.id]);
  todo.categories = categoriesResult.rows;
  
  return todo;
};

export const updateTodoCategories = async (todoId: number, categoryIds: number[], userId: number): Promise<void> => {
  // First verify the todo belongs to the user
  const todoExists = await query(
    'SELECT id FROM todos WHERE id = $1 AND user_id = $2',
    [todoId, userId]
  );
  
  if (todoExists.rows.length === 0) {
    throw new Error('Todo not found');
  }
  
  // Remove existing category associations
  await query(
    'DELETE FROM todo_categories WHERE todo_id = $1',
    [todoId]
  );
  
  // Add new category associations
  if (categoryIds.length > 0) {
    const values = categoryIds.map((categoryId, index) => 
      `($1, $${index + 2})`
    ).join(', ');
    
    await query(
      `INSERT INTO todo_categories (todo_id, category_id) VALUES ${values}`,
      [todoId, ...categoryIds]
    );
  }
};