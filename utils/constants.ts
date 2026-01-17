// Professional Black & White Theme
export const COLORS = {
  // Primary palette
  primary: '#000000',
  secondary: '#FFFFFF',
  
  // Grays
  gray900: '#111111',
  gray800: '#1A1A1A',
  gray700: '#2D2D2D',
  gray600: '#404040',
  gray500: '#666666',
  gray400: '#888888',
  gray300: '#AAAAAA',
  gray200: '#CCCCCC',
  gray100: '#E5E5E5',
  gray50: '#F5F5F5',
  
  // Functional
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  
  // Glass effects
  glassDark: 'rgba(0, 0, 0, 0.7)',
  glassMedium: 'rgba(0, 0, 0, 0.5)',
  glassLight: 'rgba(0, 0, 0, 0.3)',
  glassWhite: 'rgba(255, 255, 255, 0.1)',
  glassWhiteMedium: 'rgba(255, 255, 255, 0.15)',
  
  // Borders
  borderLight: 'rgba(255, 255, 255, 0.2)',
  borderDark: 'rgba(0, 0, 0, 0.3)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Animation constants
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// API Configuration
export const API_CONFIG = {
  defaultEndpoint: 'https://api.example.com/v1/analyze',
  timeout: 30000,
};
