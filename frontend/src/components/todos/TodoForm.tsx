import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';
import { CreateTodoRequest, UpdateTodoRequest, Todo, Category } from '../../types';
import { categoryService } from '../../services/categoryService';

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 640px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.15s;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const CategorySelection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CategoryTag = styled.button<{ selected: boolean; color: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 2px solid ${props => props.selected ? props.color : props.theme.colors.border};
  background-color: ${props => props.selected ? props.color : props.theme.colors.surface};
  color: ${props => props.selected ? 'white' : props.theme.colors.textSecondary};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: ${props => props.color};
    background-color: ${props => props.selected ? props.color : `${props.color}20`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoCategories = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`;

interface TodoFormProps {
  initialData?: Todo;
  onSubmit: (data: CreateTodoRequest | UpdateTodoRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium' as const,
    due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '',
  });
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialData?.categories?.map(cat => cat.id) || []
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: CreateTodoRequest | UpdateTodoRequest = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      due_date: formData.due_date || undefined,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    };

    await onSubmit(submitData);
    
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
      });
      setSelectedCategories([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter todo title"
            required
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter todo description (optional)"
            disabled={isLoading}
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              disabled={isLoading}
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>Categories (optional)</Label>
          <CategorySelection>
            {categories.map(category => (
              <CategoryTag
                key={category.id}
                type="button"
                selected={selectedCategories.includes(category.id)}
                color={category.color}
                onClick={() => toggleCategory(category.id)}
                disabled={isLoading}
              >
                {category.name}
              </CategoryTag>
            ))}
            {categories.length === 0 && (
              <NoCategories>
                No categories available. Create some categories first!
              </NoCategories>
            )}
          </CategorySelection>
        </FormGroup>

        <ButtonGroup>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !formData.title.trim()}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Todo' : 'Create Todo'}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};