import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { TodoList } from '../components/todos/TodoList';
import { CategoryList } from '../components/categories/CategoryList';
import { Navigation } from '../components/layout/Navigation';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.small};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 2rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-self: end;

  @media (max-width: 768px) {
    justify-self: stretch;
  }
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Content = styled.main`
  padding: 0;
`;

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'todos' | 'categories'>('todos');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | undefined>();

  const getPageTitle = () => {
    switch (currentView) {
      case 'todos':
        return selectedCategoryFilter ? 'Filtered Todos' : 'Todo Dashboard';
      case 'categories':
        return 'Categories';
      default:
        return 'Dashboard';
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryFilter(categoryId);
    setCurrentView('todos');
  };

  const handleViewChange = (view: 'todos' | 'categories') => {
    if (view === 'categories') {
      setSelectedCategoryFilter(undefined);
    }
    setCurrentView(view);
  };

  return (
    <Container>
      <Header>
        <Title>{getPageTitle()}</Title>
        <Navigation currentView={currentView} onViewChange={handleViewChange} />
        <UserInfo>
          <UserName>Welcome, {user?.name}!</UserName>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </UserInfo>
      </Header>
      <Content>
        {currentView === 'todos' ? (
          <TodoList initialCategoryFilter={selectedCategoryFilter} />
        ) : (
          <CategoryList onCategoryClick={handleCategoryClick} />
        )}
      </Content>
    </Container>
  );
};