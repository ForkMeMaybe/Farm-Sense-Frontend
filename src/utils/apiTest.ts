// Simple API test utility
import apiClient from '../services/api';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    const baseURL = import.meta.env.DEV 
      ? 'Using Vite proxy (relative URLs)' 
      : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    console.log('Base URL:', baseURL);
    
    // Test basic connectivity with better error handling
    const response = await apiClient.get('/auth/users/me/');
    console.log('✅ API connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ API connection failed:', error.message);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error: Check if backend is running and accessible');
      console.error('💡 Try: 1) Check backend is running, 2) Verify ngrok tunnel is active, 3) Check CORS settings');
    } else if (error.response?.status === 401) {
      console.error('🔐 Authentication Error: This is expected if not logged in');
    } else if (error.response?.status === 0) {
      console.error('🚫 CORS Error: Backend is blocking the request');
      console.error('💡 Solution: Update backend CORS settings to allow ngrok-skip-browser-warning header');
    }
    
    console.error('Error details:', error.response?.data);
    return { success: false, error: error.message, details: error.response?.data };
  }
};

export const testLivestockEndpoint = async () => {
  try {
    console.log('Testing livestock endpoint...');
    const response = await apiClient.get('/api/livestock/');
    console.log('✅ Livestock endpoint successful:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Livestock endpoint failed:', error.message);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error: Cannot reach livestock endpoint');
    } else if (error.response?.status === 401) {
      console.error('🔐 Authentication required: Please log in first');
    } else if (error.response?.status === 0) {
      console.error('🚫 CORS Error: Backend CORS policy is blocking the request');
    }
    
    console.error('Error details:', error.response?.data);
    return { success: false, error: error.message, details: error.response?.data };
  }
};

// Auto-test on import (for debugging)
if (typeof window !== 'undefined') {
  // Only run in browser
  setTimeout(() => {
    console.log('🔍 Running API tests...');
    testApiConnection();
    testLivestockEndpoint();
  }, 2000);
}
