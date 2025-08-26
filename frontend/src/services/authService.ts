import { apiService } from './apiService';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', credentials);
  }

  async logout(): Promise<void> {
    return apiService.post<void>('/auth/logout');
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/refresh', { refreshToken });
  }

  async getProfile(): Promise<User> {
    return apiService.get<User>('/auth/profile');
  }

  async checkAuth(): Promise<{ valid: boolean; message: string }> {
    return apiService.get<{ valid: boolean; message: string }>('/auth/check');
  }

  // GitHub OAuth
  getGithubAuthUrl(): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
    return `${baseUrl}/auth/github`;
  }

  // Password reset (future implementation)
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/reset-password', {
      token,
      password: newPassword,
    });
  }

  // Email verification (future implementation)
  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/resend-verification');
  }
}

export const authService = new AuthService();