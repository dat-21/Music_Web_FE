// theme/colors.ts
// Định nghĩa bảng màu (colors palette)
export const colors = {
  // Primary colors
  primary: '#2E6BA8',
  primaryDark: '#1E4D7F',
  primaryLight: '#4A8FD8',
  
  // Secondary colors
  secondary: '#F5F5F5',
  secondaryDark: '#E0E0E0',
  
  // Text colors
  text: '#333333',
  textLight: '#666666',
  textDark: '#000000',
  
  // Background colors
  white: '#FFFFFF',
  background: '#F5F5F5',
  backgroundDark: '#E8E8E8',
  
  // Accent colors
  accent: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',
  
  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
} as const;

// Export type for TypeScript support
export type Colors = typeof colors;