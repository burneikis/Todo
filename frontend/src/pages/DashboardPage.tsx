import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

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
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeMessage = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Header>
        <Title>Todo Dashboard</Title>
        <UserInfo>
          <UserName>Welcome, {user?.name}!</UserName>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </UserInfo>
      </Header>
      <Content>
        <WelcomeMessage>
          <h2>Welcome to your Todo Dashboard!</h2>
          <p>Your todo management interface will be implemented in Phase 2.</p>
        </WelcomeMessage>
      </Content>
    </Container>
  );
};