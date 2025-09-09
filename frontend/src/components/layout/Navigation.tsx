import React from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

const NavButton = styled(Button)<{ active?: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};

  &:hover:not(:disabled) {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
    color: ${props => props.active ? 'white' : props.theme.colors.text};
    border-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textMuted};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textMuted};
    border-color: ${props => props.theme.colors.border};
    cursor: not-allowed;

    &:hover {
      background-color: ${props => props.theme.colors.background};
      color: ${props => props.theme.colors.textMuted};
      border-color: ${props => props.theme.colors.border};
    }
  }
`;

interface NavigationProps {
  currentView: 'todos' | 'categories';
  onViewChange: (view: 'todos' | 'categories') => void;
}

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <Nav>
      <NavButtons>
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
      </NavButtons>
      <ThemeToggle showLabel={false} />
    </Nav>
  );
};