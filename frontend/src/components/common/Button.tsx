import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const StyledButton = styled.button<{ variant: string }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          &:hover {
            background-color: #2563eb;
          }
          &:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover {
            background-color: #e5e7eb;
          }
          &:disabled {
            background-color: #f9fafb;
            color: #9ca3af;
            cursor: not-allowed;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover {
            background-color: #dc2626;
          }
          &:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }
        `;
      default:
        return '';
    }
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      variant={variant}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};