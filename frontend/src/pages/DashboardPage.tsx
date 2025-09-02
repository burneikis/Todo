import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { TodoList } from '../components/todos/TodoList';
import { CategoryList } from '../components/categories/CategoryList';
import { Navigation } from '../components/layout/Navigation';

const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
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
  color: #111827;
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
  color: #374151;
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