import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const InputWrapper = styled.div<{ hasError?: boolean; hasLeftIcon?: boolean; hasRightIcon?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  ${({ hasLeftIcon, theme }) =>
    hasLeftIcon &&
    css`
      input {
        padding-left: ${theme.space[10]};
      }
    `}

  ${({ hasRightIcon, theme }) =>
    hasRightIcon &&
    css`
      input {
        padding-right: ${theme.space[10]};
      }
    `}
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px
      ${({ theme, hasError }) =>
        hasError ? `${theme.colors.error}20` : theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }

  ${({ hasError, theme }) =>
    hasError &&
    css`
      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 3px ${theme.colors.error}20;
      }
    `}
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position, theme }) =>
    position === 'left'
      ? css`
          left: ${theme.space[3]};
        `
      : css`
          right: ${theme.space[3]};
        `}
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
`;

const HelperText = styled.div<{ isError?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.gray[600]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <InputContainer fullWidth={fullWidth} className={className}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <InputWrapper
          hasError={hasError}
          hasLeftIcon={!!leftIcon}
          hasRightIcon={!!rightIcon}
        >
          {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
          <StyledInput ref={ref} hasError={hasError} {...props} />
          {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
        </InputWrapper>
        {(error || helperText) && (
          <HelperText isError={hasError}>{error || helperText}</HelperText>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';