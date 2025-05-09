// Centralized API base URL
// API_BASE_URL is empty in development (use CRA proxy), or production URL otherwise
export const API_BASE_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL;
