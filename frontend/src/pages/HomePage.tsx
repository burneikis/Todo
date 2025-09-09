import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/common/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => 
    theme.mode === 'dark' 
      ? 'linear-gradient(135deg, #1e3a8a 0%, #581c87 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  color: white;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const HomePage: React.FC = () => {
  return (
    <Container>
      <Title>Todo App</Title>
      <Subtitle>Organize your tasks efficiently</Subtitle>
      <ButtonGroup>
        <Link to="/login">
          <Button>Sign In</Button>
        </Link>
        <Link to="/register">
          <Button variant="secondary">Sign Up</Button>
        </Link>
      </ButtonGroup>
    </Container>
  );
};