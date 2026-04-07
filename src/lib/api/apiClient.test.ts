/**
 * Unit tests for API Client
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import {
  apiClient,
  isAuthError,
  isNetworkError,
  type ApiError,
} from './apiClient';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    describe('getAuthState', () => {
      it('should return authenticated state when session exists', async () => {
        const mockSession = {
          user: {
            id: 'user-123',
            email: 'admin@example.com',
          },
        };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
          data: { session: mockSession },
          error: null,
        } as any);

        const state = await apiClient.getAuthState();

        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual({
          id: 'user-123',
          email: 'admin@example.com',
        });
      });

      it('should return unauthenticated state when no session', async () => {
        vi.mocked(supabase.auth.getSession).mockResolvedValue({
          data: { session: null },
          error: null,
        } as any);

        const state = await apiClient.getAuthState();

        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
      });
    });

    describe('signIn', () => {
      it('should sign in successfully with valid credentials', async () => {
        const mockSession = {
          user: {
            id: 'user-123',
            email: 'admin@example.com',
          },
        };

        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
          data: { session: mockSession, user: mockSession.user },
          error: null,
        } as any);

        const result = await apiClient.signIn('admin@example.com', 'password123');

        expect(result.success).toBe(true);
        expect(result.data?.isAuthenticated).toBe(true);
        expect(result.data?.user?.email).toBe('admin@example.com');
        expect(result.error).toBeNull();
      });

      it('should return error with invalid credentials', async () => {
        const mockError = {
          message: 'Invalid login credentials',
          code: 'invalid_credentials',
        };

        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
          data: { session: null, user: null },
          error: mockError,
        } as any);

        const result = await apiClient.signIn('admin@example.com', 'wrongpassword');

        expect(result.success).toBe(false);
        expect(result.data).toBeNull();
        expect(result.error?.message).toBe('Invalid login credentials');
      });
    });

    describe('signOut', () => {
      it('should sign out successfully', async () => {
        vi.mocked(supabase.auth.signOut).mockResolvedValue({
          error: null,
        } as any);

        const result = await apiClient.signOut();

        expect(result.success).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should handle sign out errors', async () => {
        const mockError = {
          message: 'Sign out failed',
          code: 'signout_error',
        };

        vi.mocked(supabase.auth.signOut).mockResolvedValue({
          error: mockError,
        } as any);

        const result = await apiClient.signOut();

        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('Sign out failed');
      });
    });
  });

  describe('CRUD Operations', () => {
    describe('fetchAll', () => {
      it('should fetch all records successfully', async () => {
        const mockData = [
          { id: '1', title: 'Item 1' },
          { id: '2', title: 'Item 2' },
        ];

        const mockQuery = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.fetchAll('services');

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockData);
        expect(result.error).toBeNull();
      });

      it('should apply filters correctly', async () => {
        const mockQuery = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({ data: [], error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        await apiClient.fetchAll('services', {
          filters: { published: true },
          orderBy: { column: 'created_at', ascending: false },
          limit: 10,
        });

        expect(mockQuery.eq).toHaveBeenCalledWith('published', true);
        expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
        expect(mockQuery.limit).toHaveBeenCalledWith(10);
      });

      it('should handle fetch errors', async () => {
        const mockError = {
          message: 'Database error',
          code: 'PGRST116',
        };

        const mockQuery = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({ data: null, error: mockError }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.fetchAll('services');

        expect(result.success).toBe(false);
        expect(result.data).toBeNull();
        expect(result.error?.message).toBe('Database error');
      });
    });

    describe('fetchById', () => {
      it('should fetch a single record by ID', async () => {
        const mockData = { id: '1', title: 'Item 1' };

        const mockQuery = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.fetchById('services', '1');

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockData);
        expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
      });

      it('should handle not found errors', async () => {
        const mockError = {
          message: 'No rows found',
          code: 'PGRST116',
        };

        const mockQuery = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.fetchById('services', '999');

        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('No rows found');
      });
    });

    describe('create', () => {
      it('should create a new record', async () => {
        const newData = { title: 'New Item', description: 'Description' };
        const createdData = { id: '1', ...newData, created_at: '2024-01-01' };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
          data: { session: null },
          error: null,
        } as any);

        const mockQuery = {
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: createdData, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.create('services', newData);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(createdData);
        expect(mockQuery.insert).toHaveBeenCalledWith([newData]);
      });

      it('should add created_by when authenticated', async () => {
        const newData = { title: 'New Item', description: 'Description' };
        const mockSession = {
          user: { id: 'user-123', email: 'admin@example.com' },
        };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
          data: { session: mockSession },
          error: null,
        } as any);

        const mockQuery = {
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        await apiClient.create('services', newData);

        expect(mockQuery.insert).toHaveBeenCalledWith([
          { ...newData, created_by: 'user-123' },
        ]);
      });
    });

    describe('update', () => {
      it('should update an existing record', async () => {
        const updates = { title: 'Updated Title' };
        const updatedData = { id: '1', title: 'Updated Title', updated_at: '2024-01-01' };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
          data: { session: null },
          error: null,
        } as any);

        const mockQuery = {
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: updatedData, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.update('services', '1', updates);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(updatedData);
        expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
      });

      it('should add updated_by when authenticated', async () => {
        const updates = { title: 'Updated Title' };
        const mockSession = {
          user: { id: 'user-123', email: 'admin@example.com' },
        };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
          data: { session: mockSession },
          error: null,
        } as any);

        const mockQuery = {
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        await apiClient.update('services', '1', updates);

        expect(mockQuery.update).toHaveBeenCalledWith({
          ...updates,
          updated_by: 'user-123',
        });
      });
    });

    describe('delete', () => {
      it('should delete a record', async () => {
        const mockQuery = {
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.delete('services', '1');

        expect(result.success).toBe(true);
        expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
      });

      it('should handle delete errors', async () => {
        const mockError = {
          message: 'Delete failed',
          code: 'PGRST116',
        };

        const mockQuery = {
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ error: mockError }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.delete('services', '1');

        expect(result.success).toBe(false);
        expect(result.error?.message).toBe('Delete failed');
      });
    });

    describe('bulkUpdate', () => {
      it('should update multiple records', async () => {
        const ids = ['1', '2', '3'];
        const updates = { published: true };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
          data: { session: null },
          error: null,
        } as any);

        const mockQuery = {
          update: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({ error: null, count: 3 }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.bulkUpdate('services', ids, updates);

        expect(result.success).toBe(true);
        expect(result.data).toBe(3);
        expect(mockQuery.in).toHaveBeenCalledWith('id', ids);
      });
    });

    describe('bulkDelete', () => {
      it('should delete multiple records', async () => {
        const ids = ['1', '2', '3'];

        const mockQuery = {
          delete: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({ error: null, count: 3 }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.bulkDelete('services', ids);

        expect(result.success).toBe(true);
        expect(result.data).toBe(3);
        expect(mockQuery.in).toHaveBeenCalledWith('id', ids);
      });
    });

    describe('search', () => {
      it('should search records across multiple fields', async () => {
        const mockData = [
          { id: '1', title: 'Health Service', description: 'Description' },
        ];

        const mockQuery = {
          select: vi.fn().mockReturnThis(),
          or: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        };

        vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

        const result = await apiClient.search('services', 'health', ['title', 'description']);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockData);
        expect(mockQuery.or).toHaveBeenCalledWith('title.ilike.%health%,description.ilike.%health%');
      });
    });
  });

  describe('Error Utilities', () => {
    describe('isAuthError', () => {
      it('should identify authentication errors', () => {
        const authError: ApiError = {
          message: 'Unauthorized',
          code: 'PGRST301',
        };

        expect(isAuthError(authError)).toBe(true);
      });

      it('should identify custom auth errors', () => {
        const authError: ApiError = {
          message: 'Authentication failed',
          code: 'AUTH_ERROR',
        };

        expect(isAuthError(authError)).toBe(true);
      });

      it('should not identify non-auth errors', () => {
        const otherError: ApiError = {
          message: 'Database error',
          code: 'PGRST116',
        };

        expect(isAuthError(otherError)).toBe(false);
      });
    });

    describe('isNetworkError', () => {
      it('should identify network errors by message', () => {
        const networkError: ApiError = {
          message: 'Network request failed',
        };

        expect(isNetworkError(networkError)).toBe(true);
      });

      it('should identify fetch errors', () => {
        const fetchError: ApiError = {
          message: 'Failed to fetch',
        };

        expect(isNetworkError(fetchError)).toBe(true);
      });

      it('should identify network errors by code', () => {
        const networkError: ApiError = {
          message: 'Connection failed',
          code: 'NETWORK_ERROR',
        };

        expect(isNetworkError(networkError)).toBe(true);
      });

      it('should not identify non-network errors', () => {
        const otherError: ApiError = {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
        };

        expect(isNetworkError(otherError)).toBe(false);
      });
    });
  });
});
