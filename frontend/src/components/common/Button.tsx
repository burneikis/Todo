import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: React.CSSProperties;
}

const StyledButton = styled.button<{ variant: string; size: string }>`
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        `;
      case 'large':
        return `
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}
  
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
  size = 'medium',
  disabled = false,
  style,
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
      style={style}
    >
      {children}
    </StyledButton>
  );
};