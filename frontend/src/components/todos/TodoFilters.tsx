import React from 'react';
import styled from 'styled-components';
import { Category } from '../../types';

const FiltersContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const FiltersTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StatusTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

const StatusTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  font-weight: ${props => props.active ? 600 : 400};
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: #3b82f6;
  }
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const FilterSummary = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

export interface TodoFilters {
  search: string;
  status: 'all' | 'completed' | 'pending';
  priority: 'all' | 'low' | 'medium' | 'high';
  category: 'all' | number;
  sortBy: 'created_at' | 'due_date' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface TodoFiltersProps {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
  totalCount: number;
  filteredCount: number;
  categories?: Category[];
}

export const TodoFiltersComponent: React.FC<TodoFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  categories = [],
}) => {
  const handleFilterChange = (key: keyof TodoFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all';

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>Filter & Sort Todos</FiltersTitle>
        {hasActiveFilters && (
          <ClearButton onClick={handleClearFilters}>
            Clear Filters
          </ClearButton>
        )}
      </FiltersHeader>
      
      <StatusTabs>
        {['all', 'pending', 'completed'].map((status) => (
          <StatusTab
            key={status}
            active={filters.status === status}
            onClick={() => handleFilterChange('status', status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusTab>
        ))}
      </StatusTabs>

      <FiltersGrid>
        <FilterGroup>
          <FilterLabel htmlFor="search">Search</FilterLabel>
          <SearchInput
            id="search"
            type="text"
            placeholder="Search todos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="priority">Priority</FilterLabel>
          <Select
            id="priority"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="category">Category</FilterLabel>
          <Select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="sortBy">Sort By</FilterLabel>
          <Select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="created_at">Date Created</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="sortOrder">Sort Order</FilterLabel>
          <Select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Select>
        </FilterGroup>
      </FiltersGrid>

      <FilterSummary>
        Showing {filteredCount} of {totalCount} todos
        {hasActiveFilters && ' (filtered)'}
      </FilterSummary>
    </FiltersContainer>
  );
};