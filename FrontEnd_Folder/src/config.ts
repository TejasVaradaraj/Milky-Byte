// API Configuration
// This uses environment variables to switch between local and production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const config = {
  apiUrl: API_BASE_URL,
};

