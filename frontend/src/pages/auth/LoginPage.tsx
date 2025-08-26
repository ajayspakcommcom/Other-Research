import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthActions } from '@/hooks/useAuthActions';
import { authService } from '@/services/authService';
import { LoginCredentials } from '@/types/auth';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[800]} 100%);
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.space[8]};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 400px;
  margin: ${({ theme }) => theme.space[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.space[6]} 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray[300]};
  }

  span {
    padding: 0 ${({ theme }) => theme.space[4]};
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.colors.gray[600]};

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearAuthError } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    clearAuthError();
    const success = await login(data);
    
    if (success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  const handleGithubLogin = () => {
    window.location.href = authService.getGithubAuthUrl();
  };

  return (
    <Container>
      <Card>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account to continue</Subtitle>

        <Button
          variant="outline"
          fullWidth
          leftIcon={<FaGithub />}
          onClick={handleGithubLogin}
        >
          Continue with GitHub
        </Button>

        <Divider>
          <span>or</span>
        </Divider>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            placeholder="Enter your email"
            leftIcon={<FaEnvelope />}
            error={errors.email?.message}
            fullWidth
            {...register('email')}
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            leftIcon={<FaLock />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
            error={errors.password?.message}
            fullWidth
            {...register('password')}
          />

          {error && (
            <div style={{ color: 'red', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </Form>

        <SignupLink>
          Don't have an account?{' '}
          <Link to="/auth/register">Sign up here</Link>
        </SignupLink>
      </Card>
    </Container>
  );
};

export default LoginPage;