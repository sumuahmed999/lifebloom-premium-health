/**
 * API Client Utility
 * 
 * A thin wrapper around the Supabase client that provides:
 * - Consistent error handling
 * - Type-safe operations
 * - Authentication state management
 * - Response formatting
 * 
 * This utility layer makes it easier to work with Supabase for content management operations.
 */

import { supabase } from '@/integrations/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

// ============================================================================
// Types
// ============================================================================

/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

/**
 * Standardized error format
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Convert Supabase PostgrestError to standardized ApiError
 */
function formatError(error: PostgrestError | Error | unknown): ApiError {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }

  // Handle PostgrestError from Supabase
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const pgError = error as PostgrestError;
    return {
      message: pgError.message || 'Database operation failed',
      code: pgError.code,
      details: pgError.details,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
    };
  }

  // Handle unknown error types
  return {
    message: String(error),
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: ApiError): boolean {
  return error.code === 'PGRST301' || error.code === 'AUTH_ERROR';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: ApiError): boolean {
  return error.message.includes('network') || 
         error.message.includes('fetch') ||
         error.code === 'NETWORK_ERROR';
}

// ============================================================================
// Authentication
// ============================================================================

/**
 * Get current authentication state
 */
export async function getAuthState(): Promise<AuthState> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }

  return {
    isAuthenticated: true,
    user: {
      id: session.user.id,
      email: session.user.email || '',
    },
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<ApiResponse<AuthState>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    if (!data.session?.user) {
      return {
        data: null,
        error: {
          message: 'Authentication failed',
          code: 'AUTH_ERROR',
        },
        success: false,
      };
    }

    return {
      data: {
        isAuthenticated: true,
        user: {
          id: data.session.user.id,
          email: data.session.user.email || '',
        },
      },
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: null,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Listen to authentication state changes
 */
export function onAuthStateChange(callback: (state: AuthState) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session?.user) {
      callback({
        isAuthenticated: false,
        user: null,
      });
    } else {
      callback({
        isAuthenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email || '',
        },
      });
    }
  });

  return subscription;
}

// ============================================================================
// Generic CRUD Operations
// ============================================================================

/**
 * Fetch all records from a table with optional filters
 */
export async function fetchAll<T>(
  table: string,
  options?: {
    filters?: Record<string, unknown>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  }
): Promise<ApiResponse<T[]>> {
  try {
    let query = supabase.from(table).select('*');

    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? false,
      });
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: (data as T[]) || [],
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Fetch a single record by ID
 */
export async function fetchById<T>(
  table: string,
  id: string
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: data as T,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Create a new record
 */
export async function create<T>(
  table: string,
  data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
): Promise<ApiResponse<T>> {
  try {
    const authState = await getAuthState();
    
    // Add created_by if authenticated
    const recordData = authState.isAuthenticated
      ? { ...data, created_by: authState.user?.id }
      : data;

    const { data: result, error } = await supabase
      .from(table)
      .insert([recordData])
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: result as T,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Update an existing record
 */
export async function update<T>(
  table: string,
  id: string,
  updates: Partial<T>
): Promise<ApiResponse<T>> {
  try {
    const authState = await getAuthState();
    
    // Add updated_by if authenticated
    const recordData = authState.isAuthenticated
      ? { ...updates, updated_by: authState.user?.id }
      : updates;

    const { data, error } = await supabase
      .from(table)
      .update(recordData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: data as T,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Delete a record
 */
export async function deleteRecord(
  table: string,
  id: string
): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: null,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Bulk update multiple records
 */
export async function bulkUpdate<T>(
  table: string,
  ids: string[],
  updates: Partial<T>
): Promise<ApiResponse<number>> {
  try {
    const authState = await getAuthState();
    
    // Add updated_by if authenticated
    const recordData = authState.isAuthenticated
      ? { ...updates, updated_by: authState.user?.id }
      : updates;

    const { error, count } = await supabase
      .from(table)
      .update(recordData)
      .in('id', ids);

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: count || 0,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Bulk delete multiple records
 */
export async function bulkDelete(
  table: string,
  ids: string[]
): Promise<ApiResponse<number>> {
  try {
    const { error, count } = await supabase
      .from(table)
      .delete()
      .in('id', ids);

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: count || 0,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

/**
 * Search records with text matching
 */
export async function search<T>(
  table: string,
  searchTerm: string,
  searchFields: string[]
): Promise<ApiResponse<T[]>> {
  try {
    // Build OR conditions for each search field
    let query = supabase.from(table).select('*');
    
    // Use ilike for case-insensitive search
    const orConditions = searchFields
      .map(field => `${field}.ilike.%${searchTerm}%`)
      .join(',');
    
    query = query.or(orConditions);

    const { data, error } = await query;

    if (error) {
      return {
        data: null,
        error: formatError(error),
        success: false,
      };
    }

    return {
      data: (data as T[]) || [],
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: formatError(error),
      success: false,
    };
  }
}

// ============================================================================
// Exports
// ============================================================================

export const apiClient = {
  // Authentication
  getAuthState,
  signIn,
  signOut,
  onAuthStateChange,
  
  // CRUD operations
  fetchAll,
  fetchById,
  create,
  update,
  delete: deleteRecord,
  bulkUpdate,
  bulkDelete,
  search,
  
  // Error utilities
  isAuthError,
  isNetworkError,
};

export default apiClient;
