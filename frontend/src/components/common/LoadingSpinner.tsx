import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '1rem';
      case 'lg':
        return '3rem';
      default:
        return '2rem';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm':
        return '1rem';
      case 'lg':
        return '3rem';
      default:
        return '2rem';
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 2px solid ${({ theme }) => theme.colors.primary[600]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin: 0;
`;

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  fullHeight = true,
}) => {
  if (!fullHeight) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Spinner size={size} />
        {text && <span>{text}</span>}
      </div>
    );
  }

  return (
    <SpinnerContainer>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
};