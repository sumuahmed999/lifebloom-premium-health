/**
 * useContent Hook
 * 
 * React hook for managing content CRUD operations with loading and error states.
 * Provides optimistic updates for better UX.
 * 
 * Requirements: 2.4, 2.6, 2.7, 3.4, 3.6, 3.7, 4.4, 4.8, 4.9, 5.4, 5.8, 5.9, 6.4
 */

import { useState, useEffect, useCallback } from 'react';
import { ContentService, CONTENT_TABLES } from '@/lib/services/ContentService';
import type { Service, Testimonial, BlogPost, VideoPost, ContactInfo } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

/**
 * Content type keys
 */
export type ContentType = keyof typeof CONTENT_TABLES;

/**
 * Union type for all content types
 */
export type ContentItem = Service | Testimonial | BlogPost | VideoPost | ContactInfo;

/**
 * Return type for useContent hook
 */
export interface UseContentReturn<T extends ContentItem> {
  /** Array of content items */
  items: T[];
  /** Loading state during fetch operations */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch items from the server */
  refetch: () => Promise<void>;
  /** Create a new content item */
  create: (data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => Promise<T>;
  /** Update an existing content item */
  update: (id: string, data: Partial<T>) => Promise<T>;
  /** Delete a content item */
  delete: (id: string) => Promise<void>;
  /** Bulk update multiple items */
  bulkUpdate: (ids: string[], updates: Partial<T>) => Promise<void>;
  /** Bulk delete multiple items */
  bulkDelete: (ids: string[]) => Promise<void>;
  /** Reorder items */
  reorder: (items: T[]) => Promise<void>;
}

/**
 * Options for useContent hook
 */
export interface UseContentOptions {
  /** Whether to fetch data on mount */
  fetchOnMount?: boolean;
  /** Filter options for initial fetch */
  filters?: {
    published?: boolean;
    category?: string;
    search?: string;
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for content management operations
 * 
 * @param contentType - The type of content to manage
 * @param options - Optional configuration
 * @returns Content management interface
 * 
 * @example
 * ```tsx
 * function ServicesPage() {
 *   const { items, loading, create, update, delete: deleteItem } = useContent<Service>('services');
 *   
 *   const handleCreate = async (data) => {
 *     await create(data);
 *     toast.success('Service created');
 *   };
 *   
 *   return <ContentList items={items} loading={loading} onCreate={handleCreate} />;
 * }
 * ```
 */
export function useContent<T extends ContentItem>(
  contentType: ContentType,
  options: UseContentOptions = {}
): UseContentReturn<T> {
  const { fetchOnMount = true, filters } = options;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch items from the server
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ContentService.getAll<T>(contentType, filters);
      if (response.success && response.data) {
        setItems(response.data);
      } else {
        const error = response.error 
          ? new Error(response.error.message) 
          : new Error('Failed to fetch items');
        setError(error);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch items');
      setError(error);
      console.error(`Failed to fetch ${contentType}:`, err);
    } finally {
      setLoading(false);
    }
  }, [contentType, filters]);

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    if (fetchOnMount) {
      fetchItems();
    }
  }, [fetchOnMount, fetchItems]);

  /**
   * Create a new content item
   * Uses optimistic update for better UX
   */
  const create = useCallback(async (
    data: Omit<T, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
  ): Promise<T> => {
    setError(null);

    try {
      const response = await ContentService.create<T>(contentType, data);
      
      if (response.success && response.data) {
        // Optimistic update: add to local state immediately
        setItems(prev => [...prev, response.data!]);
        return response.data;
      } else {
        const error = response.error 
          ? new Error(response.error.message) 
          : new Error('Failed to create item');
        setError(error);
        throw error;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create item');
      setError(error);
      throw error;
    }
  }, [contentType]);

  /**
   * Update an existing content item
   * Uses optimistic update for better UX
   */
  const update = useCallback(async (
    id: string,
    data: Partial<T>
  ): Promise<T> => {
    setError(null);

    // Store original item for rollback
    const originalItems = [...items];
    
    // Optimistic update: update local state immediately
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...data } as T : item
    ));

    try {
      const response = await ContentService.update<T>(contentType, id, data);
      
      if (response.success && response.data) {
        // Update with server response
        setItems(prev => prev.map(item => 
          item.id === id ? response.data! : item
        ));
        return response.data;
      } else {
        // Rollback on error
        setItems(originalItems);
        const error = response.error 
          ? new Error(response.error.message) 
          : new Error('Failed to update item');
        setError(error);
        throw error;
      }
    } catch (err) {
      // Rollback on error
      setItems(originalItems);
      
      const error = err instanceof Error ? err : new Error('Failed to update item');
      setError(error);
      throw error;
    }
  }, [contentType, items]);

  /**
   * Delete a content item
   * Uses optimistic update for better UX
   */
  const deleteItem = useCallback(async (id: string): Promise<void> => {
    setError(null);

    // Store original items for rollback
    const originalItems = [...items];
    
    // Optimistic update: remove from local state immediately
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      const response = await ContentService.delete(contentType, id);
      
      if (!response.success) {
        // Rollback on error
        setItems(originalItems);
        const error = response.error 
          ? new Error(response.error.message) 
          : new Error('Failed to delete item');
        setError(error);
        throw error;
      }
    } catch (err) {
      // Rollback on error
      setItems(originalItems);
      
      const error = err instanceof Error ? err : new Error('Failed to delete item');
      setError(error);
      throw error;
    }
  }, [contentType, items]);

  /**
   * Bulk update multiple items
   */
  const bulkUpdate = useCallback(async (
    ids: string[],
    updates: Partial<T>
  ): Promise<void> => {
    setError(null);

    // Store original items for rollback
    const originalItems = [...items];
    
    // Optimistic update
    setItems(prev => prev.map(item => 
      ids.includes(item.id) ? { ...item, ...updates } as T : item
    ));

    try {
      const response = await ContentService.bulkUpdate<T>(contentType, ids, updates);
      
      if (response.success) {
        // Refetch to ensure consistency
        await fetchItems();
      } else {
        // Rollback on error
        setItems(originalItems);
        const error = response.error 
          ? new Error(response.error.message) 
          : new Error('Failed to bulk update items');
        setError(error);
        throw error;
      }
    } catch (err) {
      // Rollback on error
      setItems(originalItems);
      
      const error = err instanceof Error ? err : new Error('Failed to bulk update items');
      setError(error);
      throw error;
    }
  }, [contentType, items, fetchItems]);

  /**
   * Bulk delete multiple items
   */
  const bulkDelete = useCallback(async (ids: string[]): Promise<void> => {
    setError(null);

    // Store original items for rollback
    const originalItems = [...items];
    
    // Optimistic update
    setItems(prev => prev.filter(item => !ids.includes(item.id)));

    try {
      const response = await ContentService.bulkDelete(contentType, ids);
      
      if (!response.success) {
        // Rollback on error
        setItems(originalItems);
        const error = response.error 
          ? new Error(response.error.message) 
          : new Error('Failed to bulk delete items');
        setError(error);
        throw error;
      }
    } catch (err) {
      // Rollback on error
      setItems(originalItems);
      
      const error = err instanceof Error ? err : new Error('Failed to bulk delete items');
      setError(error);
      throw error;
    }
  }, [contentType, items]);

  /**
   * Reorder items
   */
  const reorder = useCallback(async (reorderedItems: T[]): Promise<void> => {
    setError(null);

    // Store original items for rollback
    const originalItems = [...items];
    
    // Optimistic update
    setItems(reorderedItems);

    try {
      // Cast to the expected type for updateOrder
      const itemsWithOrder = reorderedItems.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }));
      
      const response = await ContentService.updateOrder(contentType, itemsWithOrder);
      
      if (!response.success) {
        // Rollback on error
        setItems(originalItems);
        const error = response.error 
          ? new Error(response.error.message) 
          : new Error('Failed to reorder items');
        setError(error);
        throw error;
      }
    } catch (err) {
      // Rollback on error
      setItems(originalItems);
      
      const error = err instanceof Error ? err : new Error('Failed to reorder items');
      setError(error);
      throw error;
    }
  }, [contentType, items]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    create,
    update,
    delete: deleteItem,
    bulkUpdate,
    bulkDelete,
    reorder,
  };
}

export default useContent;
