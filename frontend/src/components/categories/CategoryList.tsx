import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types';
import { categoryService } from '../../services/categoryService';
import { CategoryForm } from './CategoryForm';
import { Button } from '../common/Button';

const CategoryListContainer = styled.div`
  max-width: 800px;
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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div<{ clickable?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem;
  position: relative;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: all 0.15s;

  &:hover {
    transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.clickable ? props.theme.shadows.medium : props.theme.shadows.small};
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CategoryIcon = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
  word-break: break-word;
`;

const CategoryMeta = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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

interface CategoryListProps {
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateCategory = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory) {
      // Update mode
      try {
        setActionLoading(true);
        const updatedCategory = await categoryService.updateCategory(editingCategory.id, data as UpdateCategoryRequest);
        setCategories(prev => prev.map(category => 
          category.id === editingCategory.id ? updatedCategory : category
        ));
        setEditingCategory(null);
      } catch (err) {
        setError('Failed to update category. Please try again.');
      } finally {
        setActionLoading(false);
      }
    } else {
      // Create mode
      try {
        setActionLoading(true);
        const newCategory = await categoryService.createCategory(data as CreateCategoryRequest);
        setCategories(prev => [newCategory, ...prev]);
        setShowForm(false);
      } catch (err) {
        setError('Failed to create category. Please try again.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category? This will remove it from all todos.')) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      setError('Failed to delete category. Please try again.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleCategoryCardClick = (categoryId: number) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <CategoryListContainer>
        <LoadingSpinner>Loading categories...</LoadingSpinner>
      </CategoryListContainer>
    );
  }

  return (
    <CategoryListContainer>
      <Header>
        <Title>Categories</Title>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Category'}
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
        <CategoryForm
          onSubmit={handleCreateOrUpdateCategory}
          onCancel={() => setShowForm(false)}
          isLoading={actionLoading}
        />
      )}

      {categories.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>🏷️</EmptyStateIcon>
          <EmptyStateTitle>No categories yet</EmptyStateTitle>
          <EmptyStateText>
            Create categories to organize your todos better!
          </EmptyStateText>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            Create Your First Category
          </Button>
        </EmptyState>
      ) : (
        <CategoriesGrid>
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              clickable={!!onCategoryClick}
              onClick={() => handleCategoryCardClick(category.id)}
            >
              <CategoryHeader>
                <CategoryIcon color={category.color}>
                  {category.name.charAt(0).toUpperCase()}
                </CategoryIcon>
                <CategoryInfo>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryMeta>
                    Created: {formatDate(category.created_at)}
                  </CategoryMeta>
                </CategoryInfo>
              </CategoryHeader>

              <ButtonGroup>
                {onCategoryClick && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleCategoryCardClick(category.id);
                    }}
                  >
                    View Todos
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="small"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleEditCategory(category);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      )}

      <EditModal show={!!editingCategory}>
        <EditModalContent>
          {editingCategory && (
            <CategoryForm
              initialData={editingCategory}
              onSubmit={handleCreateOrUpdateCategory}
              onCancel={handleCancelEdit}
              isLoading={actionLoading}
            />
          )}
        </EditModalContent>
      </EditModal>
    </CategoryListContainer>
  );
};