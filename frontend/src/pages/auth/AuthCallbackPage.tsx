import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import styled from 'styled-components';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { setTokens } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[800]} 100%);
`;

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error || message) {
      toast.error(message || 'Authentication failed');
      navigate('/auth/login');
      return;
    }

    if (token && refreshToken) {
      // Store tokens and redirect to dashboard
      dispatch(setTokens({ accessToken: token, refreshToken }));
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid authentication response');
      navigate('/auth/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <Container>
      <LoadingSpinner text="Completing authentication..." />
    </Container>
  );
};

export default AuthCallbackPage;