import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.2s ease-in-out;
  position: relative;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.space[2]} ${theme.space[3]};
          font-size: ${theme.fontSizes.sm};
          min-height: 2rem;
        `;
      case 'lg':
        return css`
          padding: ${theme.space[4]} ${theme.space[6]};
          font-size: ${theme.fontSizes.lg};
          min-height: 3rem;
        `;
      default:
        return css`
          padding: ${theme.space[3]} ${theme.space[4]};
          font-size: ${theme.fontSizes.base};
          min-height: 2.5rem;
        `;
    }
  }}

  /* Color variants */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.gray[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.gray[600]};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[700]};
            border-color: ${theme.colors.gray[700]};
          }

          &:active {
            background-color: ${theme.colors.gray[800]};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[600]};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[50]};
            border-color: ${theme.colors.primary[700]};
            color: ${theme.colors.primary[700]};
          }

          &:active {
            background-color: ${theme.colors.primary[100]};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary[600]};
          border-color: transparent;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[50]};
            color: ${theme.colors.primary[700]};
          }

          &:active {
            background-color: ${theme.colors.primary[100]};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.white};
          border-color: ${theme.colors.error};

          &:hover:not(:disabled) {
            background-color: #dc2626;
            border-color: #dc2626;
          }

          &:active {
            background-color: #b91c1c;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[600]};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }

          &:active {
            background-color: ${theme.colors.primary[800]};
          }
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
`;

const IconWrapper = styled.span<{ position: 'left' | 'right' }>`
  display: inline-flex;
  align-items: center;
  ${({ position }) =>
    position === 'left'
      ? css`
          margin-right: 0.5rem;
        `
      : css`
          margin-left: 0.5rem;
        `}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {leftIcon && !isLoading && (
        <IconWrapper position="left">{leftIcon}</IconWrapper>
      )}
      {children}
      {rightIcon && !isLoading && (
        <IconWrapper position="right">{rightIcon}</IconWrapper>
      )}
    </StyledButton>
  );
};