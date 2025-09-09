import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { CategoryList } from '../components/categories/CategoryList';

const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
`;

const UserName = styled.span`
  color: #374151;
`;

const Content = styled.main`
  padding: 0;
`;

export const CategoriesPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Header>
        <Title>Categories</Title>
        <UserInfo>
          <UserName>Welcome, {user?.name}!</UserName>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </UserInfo>
      </Header>
      <Content>
        <CategoryList />
      </Content>
    </Container>
  );
};