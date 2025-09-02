import React from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

const NavButton = styled(Button)<{ active?: boolean }>`
  background-color: ${props => props.active ? '#1e40af' : 'transparent'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: 1px solid ${props => props.active ? '#1e40af' : '#d1d5db'};

  &:hover {
    background-color: ${props => props.active ? '#1e40af' : '#f3f4f6'};
    color: ${props => props.active ? 'white' : '#111827'};
    border-color: ${props => props.active ? '#1e40af' : '#9ca3af'};
  }

  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    border-color: #e5e7eb;
    cursor: not-allowed;

    &:hover {
      background-color: #f9fafb;
      color: #9ca3af;
      border-color: #e5e7eb;
    }
  }
`;

interface NavigationProps {
  currentView: 'todos' | 'categories';
  onViewChange: (view: 'todos' | 'categories') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <Nav>
      <NavButton
        variant="secondary"
        active={currentView === 'todos'}
        onClick={() => onViewChange('todos')}
      >
        📝 Todos
      </NavButton>
      <NavButton
        variant="secondary"
        active={currentView === 'categories'}
        onClick={() => onViewChange('categories')}
      >
        🏷️ Categories
      </NavButton>
    </Nav>
  );
};