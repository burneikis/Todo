import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Category } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  min-height: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    min-height: auto;
  }
`;

const FiltersTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
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
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const SearchInput = styled.input`
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

const StatusTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
`;

const StatusTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textMuted};
  font-weight: ${props => props.active ? 600 : 400};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ClearButton = styled.button<{ visible: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  cursor: ${props => props.visible ? 'pointer' : 'default'};
  transition: all 0.15s;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  opacity: ${props => props.visible ? 1 : 0};

  &:hover {
    background: ${props => props.visible ? props.theme.colors.background : props.theme.colors.surface};
    border-color: ${props => props.visible ? props.theme.colors.textMuted : props.theme.colors.border};
  }

  &:disabled {
    pointer-events: none;
  }
`;

const FilterSummary = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export interface TodoFilters {
  search: string;
  status: 'all' | 'completed' | 'pending';
  priority: 'all' | 'low' | 'medium' | 'high';
  category: 'all' | string;
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

export const TodoFiltersComponent: React.FC<TodoFiltersProps> = React.memo(({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  categories = [],
}) => {
  const [searchValue, setSearchValue] = useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);

  // Update parent filters when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({
        ...filters,
        search: debouncedSearch,
      });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof TodoFilters, value: string) => {
    if (key === 'search') {
      setSearchValue(value);
      return;
    }
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }, [filters, onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    setSearchValue('');
    onFiltersChange({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  }, [onFiltersChange]);

  const hasActiveFilters = Boolean(filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all');

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>Filter & Sort Todos</FiltersTitle>
        <ClearButton 
          visible={hasActiveFilters} 
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          Clear Filters
        </ClearButton>
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
            value={searchValue}
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
});