import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Return the data part of successful responses
        return response.data?.data || response.data;
      },
      async (error) => {
        const { response } = error;

        // Handle 401 errors (Unauthorized)
        if (response?.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken && !error.config._retry) {
            error.config._retry = true;
            
            try {
              const refreshResponse = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                { refreshToken }
              );
              
              const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
              
              // Update tokens in localStorage
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);
              
              // Retry the original request with new token
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/auth/login';
              toast.error('Session expired. Please login again.');
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token or refresh already attempted
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
            toast.error('Please login to continue.');
          }
        }

        // Handle other errors
        const errorMessage = response?.data?.message || error.message || 'An error occurred';
        
        // Don't show toast for certain endpoints
        const silentEndpoints = ['/auth/check', '/health'];
        const isSilentEndpoint = silentEndpoints.some(endpoint => 
          error.config?.url?.includes(endpoint)
        );
        
        if (!isSilentEndpoint) {
          toast.error(errorMessage);
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }

  // Upload methods
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Download methods
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.client.get('/health');
  }

  // Get axios instance for advanced usage
  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiService = new ApiService();