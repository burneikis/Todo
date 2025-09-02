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
  color: #111827;

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

const CategoryCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: relative;
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
  color: #111827;
  margin-bottom: 0.25rem;
  word-break: break-word;
`;

const CategoryMeta = styled.div`
  color: #6b7280;
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
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #9ca3af;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyStateText = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  font-size: 1.125rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
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
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const CategoryList: React.FC = () => {
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

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      setActionLoading(true);
      const newCategory = await categoryService.createCategory(data);
      setCategories(prev => [newCategory, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
    if (!editingCategory) return;

    try {
      setActionLoading(true);
      const updatedCategory = await categoryService.updateCategory(editingCategory.id, data);
      setCategories(prev => prev.map(category => 
        category.id === editingCategory.id ? updatedCategory : category
      ));
      setEditingCategory(null);
    } catch (err) {
      setError('Failed to update category. Please try again.');
    } finally {
      setActionLoading(false);
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
          onSubmit={handleCreateCategory}
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
            <CategoryCard key={category.id}>
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
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditCategory(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteCategory(category.id)}
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
              onSubmit={handleUpdateCategory}
              onCancel={handleCancelEdit}
              isLoading={actionLoading}
            />
          )}
        </EditModalContent>
      </EditModal>
    </CategoryListContainer>
  );
};