/**
 * useAuth Hook
 * 
 * React hook that wraps the apiClient authentication methods and provides
 * authentication state management to components.
 * 
 * Features:
 * - Authentication state management (user, loading, isAuthenticated)
 * - Sign in and sign out methods
 * - Session persistence and expiration handling
 * - Automatic auth state synchronization
 * 
 * Requirements: 1.2, 1.3, 1.4, 1.5
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, type AuthState } from '@/lib/api/apiClient';

// ============================================================================
// Types
// ============================================================================

/**
 * User information
 */
export interface User {
  id: string;
  email: string;
}

/**
 * Return type for useAuth hook
 */
export interface UseAuthReturn {
  /** Current authenticated user, null if not authenticated */
  user: User | null;
  /** Loading state during authentication operations */
  loading: boolean;
  /** Whether user is currently authenticated */
  isAuthenticated: boolean;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  /** Sign out current user */
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for authentication state management
 * 
 * @example
 * ```tsx
 * function LoginPage() {
 *   const { signIn, loading, isAuthenticated } = useAuth();
 *   
 *   const handleSubmit = async (email: string, password: string) => {
 *     const result = await signIn(email, password);
 *     if (result.success) {
 *       navigate('/admin');
 *     } else {
 *       showError(result.error);
 *     }
 *   };
 *   
 *   return <LoginForm onSubmit={handleSubmit} loading={loading} />;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  /**
   * Update auth state from AuthState object
   */
  const updateAuthState = useCallback((authState: AuthState) => {
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
    setLoading(false);
  }, []);

  /**
   * Initialize auth state on mount and listen for changes
   */
  useEffect(() => {
    // Get initial auth state
    const initAuth = async () => {
      try {
        const authState = await apiClient.getAuthState();
        updateAuthState(authState);
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const subscription = apiClient.onAuthStateChange((authState) => {
      updateAuthState(authState);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  /**
   * Sign in with email and password
   * 
   * @param email - User email address
   * @param password - User password
   * @returns Promise with success status and optional error message
   */
  const signIn = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      const response = await apiClient.signIn(email, password);
      
      if (response.success && response.data) {
        // Auth state will be updated via onAuthStateChange listener
        return { success: true };
      } else {
        setLoading(false);
        return {
          success: false,
          error: response.error?.message || 'Authentication failed',
        };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }, []);

  /**
   * Sign out current user
   * 
   * @returns Promise with success status and optional error message
   */
  const signOut = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      const response = await apiClient.signOut();
      
      if (response.success) {
        // Auth state will be updated via onAuthStateChange listener
        return { success: true };
      } else {
        setLoading(false);
        return {
          success: false,
          error: response.error?.message || 'Sign out failed',
        };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    signIn,
    signOut,
  };
}

export default useAuth;
