// API URL configuration
export const API_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/api'  // Development API URL
    : process.env.REACT_APP_API_URL; // Production API URL (if needed)
