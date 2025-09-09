import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }
          &:disabled {
            background-color: ${theme.colors.textMuted};
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.surface};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background};
            color: ${theme.colors.text};
          }
          &:disabled {
            background-color: ${theme.colors.background};
            color: ${theme.colors.textMuted};
            cursor: not-allowed;
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.dangerHover};
          }
          &:disabled {
            background-color: ${theme.colors.textMuted};
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