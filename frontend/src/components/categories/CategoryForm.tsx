import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';
import { CreateCategoryRequest, UpdateCategoryRequest, Category } from '../../types';

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
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
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ColorPicker = styled.input`
  width: 3rem;
  height: 3rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  background: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 0.25rem;
  }
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  background-color: ${props => props.color};
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const ColorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const presetColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#f97316', '#06b6d4', '#84cc16',
  '#ec4899', '#6b7280', '#7c3aed', '#dc2626'
];

const PresetColors = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PresetColorButton = styled.button<{ color: string; selected: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.selected ? '#111827' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    transform: scale(1.1);
  }
`;

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    color: initialData?.color || '#3b82f6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: CreateCategoryRequest | UpdateCategoryRequest = {
      name: formData.name.trim(),
      color: formData.color,
    };

    await onSubmit(submitData);
    
    if (!initialData) {
      setFormData({
        name: '',
        color: '#3b82f6',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="color">Color</Label>
          <ColorGroup>
            <ColorPicker
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              disabled={isLoading}
            />
            <ColorPreview color={formData.color}>
              {formData.name.charAt(0).toUpperCase() || 'A'}
            </ColorPreview>
          </ColorGroup>
          
          <PresetColors>
            {presetColors.map(color => (
              <PresetColorButton
                key={color}
                type="button"
                color={color}
                selected={formData.color === color}
                onClick={() => handleColorSelect(color)}
                disabled={isLoading}
                title={`Select ${color}`}
              />
            ))}
          </PresetColors>
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
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};