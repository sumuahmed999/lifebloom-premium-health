/**
 * useSearch Hook
 * 
 * React hook for implementing search and filter functionality across content items.
 * 
 * Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */

import { useState, useMemo, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

/**
 * Filter state for content filtering
 */
export interface FilterState {
  /** Published status filter (all, published, draft) */
  published?: 'all' | 'published' | 'draft';
  /** Category filter */
  category?: string;
}

/**
 * Return type for useSearch hook
 */
export interface UseSearchReturn<T> {
  /** Current search term */
  searchTerm: string;
  /** Set search term */
  setSearchTerm: (term: string) => void;
  /** Current filter state */
  filters: FilterState;
  /** Set filter state */
  setFilters: (filters: FilterState) => void;
  /** Filtered items based on search and filters */
  filteredItems: T[];
  /** Clear all search and filters */
  clearAll: () => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a value matches the search term
 */
function matchesSearch(value: unknown, searchTerm: string): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  const stringValue = String(value).toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return stringValue.includes(lowerSearchTerm);
}

/**
 * Check if an item matches the search term in any of the specified fields
 */
function itemMatchesSearch<T>(
  item: T,
  searchTerm: string,
  searchFields: (keyof T)[]
): boolean {
  if (!searchTerm) {
    return true;
  }

  return searchFields.some(field => matchesSearch(item[field], searchTerm));
}

/**
 * Check if an item matches the published filter
 */
function itemMatchesPublishedFilter<T extends { published?: boolean }>(
  item: T,
  filter: 'all' | 'published' | 'draft'
): boolean {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'published') {
    return item.published === true;
  }

  if (filter === 'draft') {
    return item.published === false;
  }

  return true;
}

/**
 * Check if an item matches the category filter
 */
function itemMatchesCategoryFilter<T extends { category?: string }>(
  item: T,
  category?: string
): boolean {
  if (!category) {
    return true;
  }

  return item.category === category;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for search and filter functionality
 * 
 * @param items - Array of items to search and filter
 * @param searchFields - Fields to search in (e.g., ['title', 'author', 'category'])
 * @returns Search and filter interface
 * 
 * @example
 * ```tsx
 * function BlogList({ blogs }: { blogs: BlogPost[] }) {
 *   const {
 *     searchTerm,
 *     setSearchTerm,
 *     filters,
 *     setFilters,
 *     filteredItems,
 *     clearAll
 *   } = useSearch(blogs, ['title', 'author', 'category']);
 *   
 *   return (
 *     <div>
 *       <input
 *         value={searchTerm}
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       <select
 *         value={filters.published || 'all'}
 *         onChange={(e) => setFilters({ ...filters, published: e.target.value })}
 *       >
 *         <option value="all">All</option>
 *         <option value="published">Published</option>
 *         <option value="draft">Draft</option>
 *       </select>
 *       <button onClick={clearAll}>Clear Filters</button>
 *       <ContentList items={filteredItems} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[]
): UseSearchReturn<T> {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    published: 'all',
  });

  /**
   * Filter items based on search term and filters
   */
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Check search term
      if (!itemMatchesSearch(item, searchTerm, searchFields)) {
        return false;
      }

      // Check published filter
      if (filters.published && filters.published !== 'all') {
        if (!itemMatchesPublishedFilter(item as T & { published?: boolean }, filters.published)) {
          return false;
        }
      }

      // Check category filter
      if (filters.category) {
        if (!itemMatchesCategoryFilter(item as T & { category?: string }, filters.category)) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchTerm, searchFields, filters]);

  /**
   * Clear all search and filters
   */
  const clearAll = useCallback(() => {
    setSearchTerm('');
    setFilters({ published: 'all' });
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredItems,
    clearAll,
  };
}

export default useSearch;
