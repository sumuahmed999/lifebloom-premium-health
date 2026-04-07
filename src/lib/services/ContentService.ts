/**
 * ContentService
 * 
 * High-level API for content management operations.
 * Provides methods for CRUD operations, bulk operations, and content reordering.
 * Uses the apiClient to interact with Supabase.
 * 
 * This service is used by React hooks and components to manage content.
 */

import { apiClient, type ApiResponse, type ApiError } from '@/lib/api/apiClient';
import type { QueryFilters } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

/**
 * Content table names mapped to content types
 */
export const CONTENT_TABLES = {
  services: 'services',
  testimonials: 'testimonials',
  blogs: 'blog_posts',
  videos: 'video_posts',
  contact: 'contact_info',
} as const;

/**
 * Retry configuration
 */
interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute an operation with retry logic
 */
async function withRetry<T>(
  operation: () => Promise<ApiResponse<T>>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<ApiResponse<T>> {
  let lastError: ApiError | null = null;
  let delay = config.delayMs;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const response = await operation();

    // Success - return immediately
    if (response.success) {
      return response;
    }

    // Store error
    lastError = response.error;

    // Don't retry on auth errors
    if (response.error && apiClient.isAuthError(response.error)) {
      return response;
    }

    // Don't retry on last attempt
    if (attempt === config.maxRetries) {
      break;
    }

    // Only retry on network errors
    if (response.error && apiClient.isNetworkError(response.error)) {
      await sleep(delay);
      delay *= config.backoffMultiplier;
    } else {
      // Non-retryable error
      return response;
    }
  }

  // All retries exhausted
  return {
    data: null,
    error: lastError || {
      message: 'Operation failed after retries',
      code: 'MAX_RETRIES_EXCEEDED',
    },
    success: false,
  };
}

/**
 * Get table name from content type
 */
function getTableName(contentType: keyof typeof CONTENT_TABLES): string {
  return CONTENT_TABLES[contentType];
}

// ============================================================================
// ContentService Class
// ============================================================================

export class ContentService {
  /**
   * Get all records with optional filters
   */
  static async getAll<T>(
    contentType: keyof typeof CONTENT_TABLES,
    filters?: QueryFilters
  ): Promise<ApiResponse<T[]>> {
    const table = getTableName(contentType);

    return withRetry(async () => {
      // Build filter options
      const options: {
        filters?: Record<string, unknown>;
        orderBy?: { column: string; ascending?: boolean };
        limit?: number;
        offset?: number;
      } = {};

      // Apply filters
      if (filters?.published !== undefined) {
        options.filters = { ...options.filters, published: filters.published };
      }
      if (filters?.category) {
        options.filters = { ...options.filters, category: filters.category };
      }

      // Apply ordering (default to sort_order ascending)
      options.orderBy = { column: 'sort_order', ascending: true };

      // Apply pagination
      if (filters?.limit) {
        options.limit = filters.limit;
      }
      if (filters?.offset) {
        options.offset = filters.offset;
      }

      // Handle search separately if provided
      if (filters?.search) {
        const searchFields = ['title', 'author', 'category', 'description', 'customer_name'];
        return apiClient.search<T>(table, filters.search, searchFields);
      }

      return apiClient.fetchAll<T>(table, options);
    });
  }

  /**
   * Get a single record by ID
   */
  static async getById<T>(
    contentType: keyof typeof CONTENT_TABLES,
    id: string
  ): Promise<ApiResponse<T>> {
    const table = getTableName(contentType);

    return withRetry(async () => {
      return apiClient.fetchById<T>(table, id);
    });
  }

  /**
   * Create a new record
   */
  static async create<T>(
    contentType: keyof typeof CONTENT_TABLES,
    data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
  ): Promise<ApiResponse<T>> {
    const table = getTableName(contentType);

    return withRetry(async () => {
      return apiClient.create<T>(table, data);
    });
  }

  /**
   * Update an existing record
   */
  static async update<T>(
    contentType: keyof typeof CONTENT_TABLES,
    id: string,
    updates: Partial<T>
  ): Promise<ApiResponse<T>> {
    const table = getTableName(contentType);

    return withRetry(async () => {
      return apiClient.update<T>(table, id, updates);
    });
  }

  /**
   * Delete a record
   */
  static async delete(
    contentType: keyof typeof CONTENT_TABLES,
    id: string
  ): Promise<ApiResponse<void>> {
    const table = getTableName(contentType);

    return withRetry(async () => {
      return apiClient.delete(table, id);
    });
  }

  /**
   * Bulk update multiple records
   */
  static async bulkUpdate<T>(
    contentType: keyof typeof CONTENT_TABLES,
    ids: string[],
    updates: Partial<T>
  ): Promise<ApiResponse<number>> {
    const table = getTableName(contentType);

    if (ids.length === 0) {
      return {
        data: 0,
        error: null,
        success: true,
      };
    }

    return withRetry(async () => {
      return apiClient.bulkUpdate<T>(table, ids, updates);
    });
  }

  /**
   * Bulk delete multiple records
   */
  static async bulkDelete(
    contentType: keyof typeof CONTENT_TABLES,
    ids: string[]
  ): Promise<ApiResponse<number>> {
    const table = getTableName(contentType);

    if (ids.length === 0) {
      return {
        data: 0,
        error: null,
        success: true,
      };
    }

    return withRetry(async () => {
      return apiClient.bulkDelete(table, ids);
    });
  }

  /**
   * Update the sort order of multiple items
   */
  static async updateOrder(
    contentType: keyof typeof CONTENT_TABLES,
    items: { id: string; sort_order: number }[]
  ): Promise<ApiResponse<void>> {
    const table = getTableName(contentType);

    if (items.length === 0) {
      return {
        data: null,
        error: null,
        success: true,
      };
    }

    return withRetry(async () => {
      try {
        // Update each item's sort_order individually
        // Note: This could be optimized with a batch update in the future
        const updatePromises = items.map(item =>
          apiClient.update(table, item.id, { sort_order: item.sort_order })
        );

        const results = await Promise.all(updatePromises);

        // Check if any updates failed
        const failedUpdate = results.find(result => !result.success);
        if (failedUpdate) {
          return {
            data: null,
            error: failedUpdate.error,
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
          error: {
            message: error instanceof Error ? error.message : 'Failed to update order',
            code: 'UPDATE_ORDER_ERROR',
          },
          success: false,
        };
      }
    });
  }

  /**
   * Get dashboard statistics
   * Returns counts for all content types
   */
  static async getDashboardStats(): Promise<ApiResponse<{
    services: { total: number; published: number; draft: number };
    testimonials: { total: number; published: number; draft: number };
    blogs: { total: number; published: number; draft: number };
    videos: { total: number; published: number; draft: number };
  }>> {
    try {
      const contentTypes: (keyof typeof CONTENT_TABLES)[] = ['services', 'testimonials', 'blogs', 'videos'];
      
      const statsPromises = contentTypes.map(async (type) => {
        const table = getTableName(type);
        
        // Get all items
        const allResponse = await apiClient.fetchAll(table);
        if (!allResponse.success || !allResponse.data) {
          return { type, total: 0, published: 0, draft: 0 };
        }

        const items = allResponse.data as Array<{ published?: boolean }>;
        const total = items.length;
        const published = items.filter(item => item.published === true).length;
        const draft = items.filter(item => item.published === false).length;

        return { type, total, published, draft };
      });

      const results = await Promise.all(statsPromises);

      const stats = results.reduce((acc, result) => {
        acc[result.type] = {
          total: result.total,
          published: result.published,
          draft: result.draft,
        };
        return acc;
      }, {} as any);

      return {
        data: stats,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
          code: 'DASHBOARD_STATS_ERROR',
        },
        success: false,
      };
    }
  }

  /**
   * Get recent content items across all types
   */
  static async getRecentContent(limit: number = 5): Promise<ApiResponse<{
    created: Array<{ type: string; item: any }>;
    updated: Array<{ type: string; item: any }>;
  }>> {
    try {
      const contentTypes: (keyof typeof CONTENT_TABLES)[] = ['services', 'testimonials', 'blogs', 'videos'];
      
      // Fetch recent items from each content type
      const recentPromises = contentTypes.map(async (type) => {
        const table = getTableName(type);
        
        const response = await apiClient.fetchAll(table, {
          orderBy: { column: 'created_at', ascending: false },
          limit: limit,
        });

        if (!response.success || !response.data) {
          return { type, items: [] };
        }

        return { type, items: response.data };
      });

      const results = await Promise.all(recentPromises);

      // Combine and sort by created_at
      const allCreated = results.flatMap(result =>
        result.items.map((item: any) => ({ type: result.type, item }))
      );
      allCreated.sort((a, b) => {
        const dateA = new Date(a.item.created_at || 0).getTime();
        const dateB = new Date(b.item.created_at || 0).getTime();
        return dateB - dateA;
      });

      // Combine and sort by updated_at
      const allUpdated = results.flatMap(result =>
        result.items.map((item: any) => ({ type: result.type, item }))
      );
      allUpdated.sort((a, b) => {
        const dateA = new Date(a.item.updated_at || 0).getTime();
        const dateB = new Date(b.item.updated_at || 0).getTime();
        return dateB - dateA;
      });

      return {
        data: {
          created: allCreated.slice(0, limit),
          updated: allUpdated.slice(0, limit),
        },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch recent content',
          code: 'RECENT_CONTENT_ERROR',
        },
        success: false,
      };
    }
  }
}

export default ContentService;
