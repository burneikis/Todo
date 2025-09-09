import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const ToggleContainer = styled.button`
  position: relative;
  width: 3rem;
  height: 1.5rem;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ToggleSwitch = styled.div<{ isDark: boolean }>`
  position: absolute;
  top: 0.125rem;
  left: ${({ isDark }) => isDark ? '1.375rem' : '0.125rem'};
  width: 1.25rem;
  height: 1.25rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const ToggleLabel = styled.span`
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = true, 
  className 
}) => {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';

  return (
    <ToggleWrapper className={className}>
      <ToggleContainer 
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <ToggleSwitch isDark={isDark}>
          {isDark ? '🌙' : '☀️'}
        </ToggleSwitch>
      </ToggleContainer>
      {showLabel && (
        <ToggleLabel>
          {isDark ? 'Dark' : 'Light'} mode
        </ToggleLabel>
      )}
    </ToggleWrapper>
  );
};