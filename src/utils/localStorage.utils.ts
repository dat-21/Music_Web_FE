import type { User } from '../types/auth.types';

// Utility functions for localStorage management

export const localStorageUtils = {
  // Set current user ID
  setCurrentUserId: (userId: string): void => {
    localStorage.setItem('currentUserId', userId);
  },

  // Get current user ID
  getCurrentUserId: (): string | null => {
    return localStorage.getItem('currentUserId');
  },

  // Remove current user ID
  removeCurrentUserId: (): void => {
    localStorage.removeItem('currentUserId');
  },

  // Set user data
  setUserData: (userData: User): void => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },

  // Get user data - TRẢ VỀ User | null
  getUserData: (): User | null => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      return parsed as User; // Type assertion an toàn hơn
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Remove user data
  removeUserData: (): void => {
    localStorage.removeItem('userData');
  },

  // Set token
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Remove token
  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  // Clear all auth data
  clearAuthData: (): void => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  }
};