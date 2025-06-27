// Use environment variable or fallback to localhost for development
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const IS_PRODUCTION = import.meta.env.PROD; 