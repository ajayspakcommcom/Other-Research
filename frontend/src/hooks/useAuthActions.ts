import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  loginAsync,
  registerAsync,
  logoutAsync,
  clearError,
} from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export const useAuthActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginAsync(credentials));
    return result.meta.requestStatus === 'fulfilled';
  };

  const register = async (credentials: RegisterCredentials) => {
    const result = await dispatch(registerAsync(credentials));
    return result.meta.requestStatus === 'fulfilled';
  };

  const logout = async () => {
    await dispatch(logoutAsync());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    login,
    register,
    logout,
    clearAuthError,
    isLoading,
    error,
  };
};