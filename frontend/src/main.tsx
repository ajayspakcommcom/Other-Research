import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'styled-components'
import { Toaster } from 'react-hot-toast'

import App from './App'
import { store } from './store'
import { theme } from './styles/theme'
import { GlobalStyles } from './styles/GlobalStyles'
import { AuthProvider } from './context/AuthContext'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HelmetProvider>
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              <AuthProvider>
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#10b981',
                      },
                    },
                    error: {
                      style: {
                        background: '#ef4444',
                      },
                    },
                  }}
                />
              </AuthProvider>
            </ThemeProvider>
          </HelmetProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)