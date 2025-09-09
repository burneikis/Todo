import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Todo, CreateTodoRequest, UpdateTodoRequest, Category } from '../../types';
import { todoService } from '../../services/todoService';
import { categoryService } from '../../services/categoryService';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { TodoFiltersComponent, TodoFilters } from './TodoFilters';
import { Button } from '../common/Button';
import { VirtualizedList } from '../common/VirtualizedList';

const TodoListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const TodosGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const VirtualizedContainer = styled.div`
  height: 600px;
  max-height: 70vh;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger}20;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 2rem;
`;

const EditModal = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const EditModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

interface TodoListProps {
  initialCategoryFilter?: number;
}

export const TodoList: React.FC<TodoListProps> = ({ initialCategoryFilter }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState<TodoFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    category: initialCategoryFilter ? initialCategoryFilter.toString() : 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  useEffect(() => {
    loadTodos();
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialCategoryFilter !== undefined) {
      setFilters(prev => ({
        ...prev,
        category: initialCategoryFilter.toString(),
      }));
    }
  }, [initialCategoryFilter]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again. (Refresh the page)');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const filteredAndSortedTodos = useMemo(() => {
    const filtered = todos.filter(todo => {
      const matchesSearch = !filters.search || 
        todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'completed' && todo.completed) ||
        (filters.status === 'pending' && !todo.completed);
      
      const matchesPriority = filters.priority === 'all' || todo.priority === filters.priority;
      
      const matchesCategory = filters.category === 'all' || 
        (todo.categories && todo.categories.some(cat => cat.id === Number(filters.category)));

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        }
        case 'due_date':
          aValue = a.due_date ? new Date(a.due_date).getTime() : 0;
          bValue = b.due_date ? new Date(b.due_date).getTime() : 0;
          break;
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [todos, filters]);

  const handleCreateOrUpdateTodo = async (data: CreateTodoRequest | UpdateTodoRequest) => {
    if (editingTodo) {
      // Update mode
      try {
        setActionLoading(true);
        const updatedTodo = await todoService.updateTodo(editingTodo.id, data as UpdateTodoRequest);
        setTodos(prev => prev.map(todo => 
          todo.id === editingTodo.id ? updatedTodo : todo
        ));
        setEditingTodo(null);
      } catch (err) {
        setError('Failed to update todo. Please try again.');
      } finally {
        setActionLoading(false);
      }
    } else {
      // Create mode
      try {
        setActionLoading(true);
        const newTodo = await todoService.createTodo(data as CreateTodoRequest);
        setTodos(prev => [newTodo, ...prev]);
        setShowForm(false);
      } catch (err) {
        setError('Failed to create todo. Please try again.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggleTodo = useCallback(async (id: number) => {
    try {
      const updatedTodo = await todoService.toggleTodo(id);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Failed to toggle todo. Please try again.');
    }
  }, []);

  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    }
  }, []);

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
  }, []);

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  if (loading) {
    return (
      <TodoListContainer>
        <LoadingSpinner>Loading todos...</LoadingSpinner>
      </TodoListContainer>
    );
  }

  return (
    <TodoListContainer>
      <Header>
        <Title>My Todos</Title>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Todo'}
        </Button>
      </Header>

      {error && (
        <ErrorMessage>
          {error}
          <Button
            variant="secondary"
            size="small"
            style={{ marginLeft: '1rem' }}
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </ErrorMessage>
      )}

      {showForm && (
        <TodoForm
          onSubmit={handleCreateOrUpdateTodo}
          onCancel={() => setShowForm(false)}
          isLoading={actionLoading}
        />
      )}

      <TodoFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={todos.length}
        filteredCount={filteredAndSortedTodos.length}
        categories={categories}
      />

      {filteredAndSortedTodos.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📝</EmptyStateIcon>
          <EmptyStateTitle>
            {todos.length === 0 ? 'No todos yet' : 'No todos match your filters'}
          </EmptyStateTitle>
          <EmptyStateText>
            {todos.length === 0 
              ? 'Get started by creating your first todo!'
              : 'Try adjusting your filters to see more todos.'
            }
          </EmptyStateText>
          {todos.length === 0 && (
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
            >
              Create Your First Todo
            </Button>
          )}
        </EmptyState>
      ) : filteredAndSortedTodos.length > 50 ? (
        <VirtualizedContainer>
          <VirtualizedList
            items={filteredAndSortedTodos}
            itemHeight={200}
            containerHeight={600}
            renderItem={(todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            )}
          />
        </VirtualizedContainer>
      ) : (
        <TodosGrid>
          {filteredAndSortedTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </TodosGrid>
      )}

      <EditModal show={!!editingTodo}>
        <EditModalContent>
          {editingTodo && (
            <TodoForm
              initialData={editingTodo}
              onSubmit={handleCreateOrUpdateTodo}
              onCancel={handleCancelEdit}
              isLoading={actionLoading}
            />
          )}
        </EditModalContent>
      </EditModal>
    </TodoListContainer>
  );
};