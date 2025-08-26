import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { verifyTokenAsync } from '@/store/slices/authSlice';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check if user is authenticated on app startup
    if (accessToken && !user) {
      dispatch(verifyTokenAsync());
    } else if (!accessToken) {
      // If no token, mark as not loading
      dispatch({ type: 'auth/verifyToken/rejected' });
    }
  }, [dispatch, accessToken, user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};