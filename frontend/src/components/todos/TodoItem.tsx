import React, { useState } from 'react';
import styled from 'styled-components';
import { Todo } from '../../types';
import { Button } from '../common/Button';

const TodoCard = styled.div<{ completed: boolean }>`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  opacity: ${props => props.completed ? 0.7 : 1};
  border-left: 4px solid ${props => {
    if (props.completed) return '#10b981';
    return 'transparent';
  }};
`;

const TodoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  cursor: pointer;
`;

const TodoContent = styled.div`
  flex: 1;
`;

const TodoTitle = styled.h3<{ completed: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.completed ? '#6b7280' : '#111827'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  margin-bottom: 0.5rem;
  word-break: break-word;
`;

const TodoDescription = styled.p<{ completed: boolean }>`
  color: ${props => props.completed ? '#9ca3af' : '#6b7280'};
  margin-bottom: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const TodoMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const PriorityBadge = styled.span<{ priority: 'low' | 'medium' | 'high' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.priority) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      case 'low': return '#dcfce7';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
    }
  }};
`;

const DueDate = styled.span<{ overdue: boolean; completed: boolean }>`
  font-size: 0.875rem;
  color: ${props => {
    if (props.completed) return '#9ca3af';
    if (props.overdue) return '#dc2626';
    return '#6b7280';
  }};
  font-weight: ${props => props.overdue && !props.completed ? 600 : 400};
`;

const CreatedDate = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    await onToggle(todo.id);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = todo.due_date && !todo.completed && new Date(todo.due_date) < new Date();

  return (
    <TodoCard completed={todo.completed}>
      <TodoHeader>
        <Checkbox
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isLoading}
        />
        <TodoContent>
          <TodoTitle completed={todo.completed}>
            {todo.title}
          </TodoTitle>
          
          {todo.description && (
            <TodoDescription completed={todo.completed}>
              {todo.description}
            </TodoDescription>
          )}

          <TodoMeta>
            <PriorityBadge priority={todo.priority}>
              {todo.priority}
            </PriorityBadge>
            
            {todo.due_date && (
              <DueDate overdue={!!isOverdue} completed={todo.completed}>
                Due: {formatDate(todo.due_date)}
                {isOverdue && !todo.completed && ' (Overdue)'}
              </DueDate>
            )}
            
            <CreatedDate>
              Created: {formatDateTime(todo.created_at)}
            </CreatedDate>
          </TodoMeta>

          <ButtonGroup>
            <Button
              variant="secondary"
              size="small"
              onClick={() => onEdit(todo)}
              disabled={isLoading || isDeleting}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </ButtonGroup>
        </TodoContent>
      </TodoHeader>
    </TodoCard>
  );
};