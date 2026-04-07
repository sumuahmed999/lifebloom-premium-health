/**
 * Unit Tests for useAuth Hook
 * 
 * Tests authentication state management, sign in/out operations,
 * and session handling.
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuth } from './useAuth';
import { apiClient } from '@/lib/api/apiClient';
import type { AuthState, ApiResponse } from '@/lib/api/apiClient';

// ============================================================================
// Mocks
// ============================================================================

vi.mock('@/lib/api/apiClient', () => ({
  apiClient: {
    getAuthState: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

// ============================================================================
// Test Helpers
// ============================================================================

const mockAuthState = (isAuthenticated: boolean): AuthState => ({
  isAuthenticated,
  user: isAuthenticated
    ? { id: 'test-user-id', email: 'test@example.com' }
    : null,
});

const mockSubscription = {
  unsubscribe: vi.fn(),
};

// ============================================================================
// Tests
// ============================================================================

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(false));
    vi.mocked(apiClient.onAuthStateChange).mockReturnValue(mockSubscription as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // --------------------------------------------------------------------------
  // Initialization Tests
  // --------------------------------------------------------------------------

  describe('initialization', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should fetch initial auth state on mount', async () => {
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(apiClient.getAuthState).toHaveBeenCalledTimes(1);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
      });
    });

    it('should handle unauthenticated state on mount', async () => {
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(false));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it('should subscribe to auth state changes on mount', () => {
      renderHook(() => useAuth());

      expect(apiClient.onAuthStateChange).toHaveBeenCalledTimes(1);
      expect(apiClient.onAuthStateChange).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should unsubscribe from auth state changes on unmount', () => {
      const { unmount } = renderHook(() => useAuth());

      unmount();

      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should handle initialization errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(apiClient.getAuthState).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  // --------------------------------------------------------------------------
  // Auth State Change Tests
  // --------------------------------------------------------------------------

  describe('auth state changes', () => {
    it('should update state when auth state changes', async () => {
      let authChangeCallback: ((state: AuthState) => void) | null = null;
      
      vi.mocked(apiClient.onAuthStateChange).mockImplementation((callback) => {
        authChangeCallback = callback;
        return mockSubscription as any;
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate auth state change to authenticated
      act(() => {
        authChangeCallback?.(mockAuthState(true));
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
      });
    });

    it('should update state when user signs out via external event', async () => {
      let authChangeCallback: ((state: AuthState) => void) | null = null;
      
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));
      vi.mocked(apiClient.onAuthStateChange).mockImplementation((callback) => {
        authChangeCallback = callback;
        return mockSubscription as any;
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Simulate sign out event
      act(() => {
        authChangeCallback?.(mockAuthState(false));
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  // --------------------------------------------------------------------------
  // Sign In Tests
  // --------------------------------------------------------------------------

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const mockResponse: ApiResponse<AuthState> = {
        success: true,
        data: mockAuthState(true),
        error: null,
      };

      vi.mocked(apiClient.signIn).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'password123');
      });

      expect(apiClient.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(signInResult).toEqual({ success: true });
    });

    it('should handle sign in failure with error message', async () => {
      const mockResponse: ApiResponse<AuthState> = {
        success: false,
        data: null,
        error: {
          message: 'Invalid credentials',
          code: 'AUTH_ERROR',
        },
      };

      vi.mocked(apiClient.signIn).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'wrongpassword');
      });

      expect(signInResult).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
      expect(result.current.loading).toBe(false);
    });

    it('should handle sign in with generic error when no error message provided', async () => {
      const mockResponse: ApiResponse<AuthState> = {
        success: false,
        data: null,
        error: null,
      };

      vi.mocked(apiClient.signIn).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'password');
      });

      expect(signInResult).toEqual({
        success: false,
        error: 'Authentication failed',
      });
    });

    it('should handle sign in exception', async () => {
      vi.mocked(apiClient.signIn).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'password');
      });

      expect(signInResult).toEqual({
        success: false,
        error: 'Network error',
      });
      expect(result.current.loading).toBe(false);
    });

    it('should set loading state during sign in', async () => {
      const mockResponse: ApiResponse<AuthState> = {
        success: true,
        data: mockAuthState(true),
        error: null,
      };

      let resolveSignIn: ((value: ApiResponse<AuthState>) => void) | null = null;
      const signInPromise = new Promise<ApiResponse<AuthState>>((resolve) => {
        resolveSignIn = resolve;
      });

      vi.mocked(apiClient.signIn).mockReturnValue(signInPromise);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Start sign in
      act(() => {
        result.current.signIn('test@example.com', 'password');
      });

      // Should be loading
      expect(result.current.loading).toBe(true);

      // Resolve sign in
      await act(async () => {
        resolveSignIn?.(mockResponse);
        await signInPromise;
      });
    });
  });

  // --------------------------------------------------------------------------
  // Sign Out Tests
  // --------------------------------------------------------------------------

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      const mockResponse: ApiResponse<void> = {
        success: true,
        data: null,
        error: null,
      };

      vi.mocked(apiClient.signOut).mockResolvedValue(mockResponse);
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      let signOutResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(apiClient.signOut).toHaveBeenCalledTimes(1);
      expect(signOutResult).toEqual({ success: true });
    });

    it('should handle sign out failure', async () => {
      const mockResponse: ApiResponse<void> = {
        success: false,
        data: null,
        error: {
          message: 'Sign out failed',
          code: 'SIGNOUT_ERROR',
        },
      };

      vi.mocked(apiClient.signOut).mockResolvedValue(mockResponse);
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      let signOutResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult).toEqual({
        success: false,
        error: 'Sign out failed',
      });
      expect(result.current.loading).toBe(false);
    });

    it('should handle sign out exception', async () => {
      vi.mocked(apiClient.signOut).mockRejectedValue(new Error('Network error'));
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      let signOutResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult).toEqual({
        success: false,
        error: 'Network error',
      });
      expect(result.current.loading).toBe(false);
    });

    it('should set loading state during sign out', async () => {
      const mockResponse: ApiResponse<void> = {
        success: true,
        data: null,
        error: null,
      };

      let resolveSignOut: ((value: ApiResponse<void>) => void) | null = null;
      const signOutPromise = new Promise<ApiResponse<void>>((resolve) => {
        resolveSignOut = resolve;
      });

      vi.mocked(apiClient.signOut).mockReturnValue(signOutPromise);
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Start sign out
      act(() => {
        result.current.signOut();
      });

      // Should be loading
      expect(result.current.loading).toBe(true);

      // Resolve sign out
      await act(async () => {
        resolveSignOut?.(mockResponse);
        await signOutPromise;
      });
    });
  });

  // --------------------------------------------------------------------------
  // Session Persistence Tests
  // --------------------------------------------------------------------------

  describe('session persistence', () => {
    it('should maintain authenticated state across hook re-renders', async () => {
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));

      const { result, rerender } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      const userBefore = result.current.user;

      rerender();

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBe(userBefore);
    });

    it('should restore session on page reload', async () => {
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(true));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
      });
    });
  });

  // --------------------------------------------------------------------------
  // Edge Cases
  // --------------------------------------------------------------------------

  describe('edge cases', () => {
    it('should handle multiple simultaneous sign in attempts', async () => {
      const mockResponse: ApiResponse<AuthState> = {
        success: true,
        data: mockAuthState(true),
        error: null,
      };

      vi.mocked(apiClient.signIn).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let result1: { success: boolean; error?: string } | undefined;
      let result2: { success: boolean; error?: string } | undefined;

      await act(async () => {
        [result1, result2] = await Promise.all([
          result.current.signIn('test@example.com', 'password1'),
          result.current.signIn('test@example.com', 'password2'),
        ]);
      });

      expect(result1?.success).toBe(true);
      expect(result2?.success).toBe(true);
      expect(apiClient.signIn).toHaveBeenCalledTimes(2);
    });

    it('should handle sign out when not authenticated', async () => {
      const mockResponse: ApiResponse<void> = {
        success: true,
        data: null,
        error: null,
      };

      vi.mocked(apiClient.signOut).mockResolvedValue(mockResponse);
      vi.mocked(apiClient.getAuthState).mockResolvedValue(mockAuthState(false));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signOutResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult?.success).toBe(true);
    });

    it('should handle empty email and password', async () => {
      const mockResponse: ApiResponse<AuthState> = {
        success: false,
        data: null,
        error: {
          message: 'Email and password are required',
          code: 'VALIDATION_ERROR',
        },
      };

      vi.mocked(apiClient.signIn).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { success: boolean; error?: string } | undefined;

      await act(async () => {
        signInResult = await result.current.signIn('', '');
      });

      expect(signInResult).toEqual({
        success: false,
        error: 'Email and password are required',
      });
    });
  });
});
