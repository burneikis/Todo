import React from 'react';
import styled from 'styled-components';
import { SignUpForm } from '../components/auth/SignUpForm';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const SignUpPage: React.FC = () => {
  return (
    <PageContainer>
      <SignUpForm />
    </PageContainer>
  );
};