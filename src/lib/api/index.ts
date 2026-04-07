/**
 * API Client Module
 * 
 * Exports the API client utility and related types
 */

export {
  apiClient,
  isAuthError,
  isNetworkError,
  getAuthState,
  signIn,
  signOut,
  onAuthStateChange,
} from './apiClient';

export type {
  ApiResponse,
  ApiError,
  AuthState,
} from './apiClient';

export { default } from './apiClient';
