/**
 * ContentService Unit Tests
 * 
 * Tests for the ContentService class covering:
 * - CRUD operations
 * - Bulk operations
 * - Content reordering
 * - Error handling
 * - Retry logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentService, CONTENT_TABLES } from './ContentService';
import * as apiClient from '@/lib/api/apiClient';
import type { Service, BlogPost } from '@/types/admin-content';

// Mock the apiClient module
vi.mock('@/lib/api/apiClient', () => ({
  apiClient: {
    fetchAll: vi.fn(),
    fetchById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    bulkUpdate: vi.fn(),
    bulkDelete: vi.fn(),
    search: vi.fn(),
    isAuthError: vi.fn(),
    isNetworkError: vi.fn(),
  },
}));

describe('ContentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CONTENT_TABLES', () => {
    it('should map content types to correct table names', () => {
      expect(CONTENT_TABLES.services).toBe('services');
      expect(CONTENT_TABLES.testimonials).toBe('testimonials');
      expect(CONTENT_TABLES.blogs).toBe('blog_posts');
      expect(CONTENT_TABLES.videos).toBe('video_posts');
      expect(CONTENT_TABLES.contact).toBe('contact_info');
      expect(CONTENT_TABLES.get_in_touch).toBe('get_in_touch_content');
      expect(CONTENT_TABLES.contact_cards).toBe('contact_cards');
    });
  });

  describe('getAll', () => {
    it('should fetch all records without filters', async () => {
      const mockServices: Service[] = [
        {
          id: '1',
          title: 'Service 1',
          description: 'Description 1',
          icon: 'heart',
          features: ['feature1'],
          color_scheme: 'blue',
          published: true,
          sort_order: 0,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          created_by: null,
          updated_by: null,
        },
      ];

      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: mockServices,
        error: null,
        success: true,
      });

      const result = await ContentService.getAll<Service>('services');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockServices);
      expect(apiClient.apiClient.fetchAll).toHaveBeenCalledWith('services', {
        orderBy: { column: 'sort_order', ascending: true },
      });
    });

    it('should apply published filter', async () => {
      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: [],
        error: null,
        success: true,
      });

      await ContentService.getAll('services', { published: true });

      expect(apiClient.apiClient.fetchAll).toHaveBeenCalledWith('services', {
        filters: { published: true },
        orderBy: { column: 'sort_order', ascending: true },
      });
    });

    it('should apply category filter', async () => {
      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: [],
        error: null,
        success: true,
      });

      await ContentService.getAll('blogs', { category: 'health' });

      expect(apiClient.apiClient.fetchAll).toHaveBeenCalledWith('blog_posts', {
        filters: { category: 'health' },
        orderBy: { column: 'sort_order', ascending: true },
      });
    });

    it('should apply pagination', async () => {
      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: [],
        error: null,
        success: true,
      });

      await ContentService.getAll('services', { limit: 10, offset: 20 });

      expect(apiClient.apiClient.fetchAll).toHaveBeenCalledWith('services', {
        orderBy: { column: 'sort_order', ascending: true },
        limit: 10,
        offset: 20,
      });
    });

    it('should use search when search term is provided', async () => {
      vi.mocked(apiClient.apiClient.search).mockResolvedValue({
        data: [],
        error: null,
        success: true,
      });

      await ContentService.getAll('services', { search: 'test' });

      expect(apiClient.apiClient.search).toHaveBeenCalledWith(
        'services',
        'test',
        ['title', 'author', 'category', 'description', 'customer_name']
      );
    });

    it('should handle errors', async () => {
      const mockError = {
        message: 'Database error',
        code: 'DB_ERROR',
      };

      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.getAll('services');

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('getById', () => {
    it('should fetch a single record by ID', async () => {
      const mockService: Service = {
        id: '1',
        title: 'Service 1',
        description: 'Description 1',
        icon: 'heart',
        features: ['feature1'],
        color_scheme: 'blue',
        published: true,
        sort_order: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        created_by: null,
        updated_by: null,
      };

      vi.mocked(apiClient.apiClient.fetchById).mockResolvedValue({
        data: mockService,
        error: null,
        success: true,
      });

      const result = await ContentService.getById<Service>('services', '1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockService);
      expect(apiClient.apiClient.fetchById).toHaveBeenCalledWith('services', '1');
    });

    it('should handle not found errors', async () => {
      const mockError = {
        message: 'Record not found',
        code: 'NOT_FOUND',
      };

      vi.mocked(apiClient.apiClient.fetchById).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.getById('services', '999');

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const newService = {
        title: 'New Service',
        description: 'New Description',
        icon: 'heart',
        features: ['feature1'],
        color_scheme: 'blue',
        published: false,
        sort_order: 0,
      };

      const createdService: Service = {
        id: '1',
        ...newService,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        created_by: null,
        updated_by: null,
      };

      vi.mocked(apiClient.apiClient.create).mockResolvedValue({
        data: createdService,
        error: null,
        success: true,
      });

      const result = await ContentService.create<Service>('services', newService);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdService);
      expect(apiClient.apiClient.create).toHaveBeenCalledWith('services', newService);
    });

    it('should handle validation errors', async () => {
      const mockError = {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      };

      vi.mocked(apiClient.apiClient.create).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.create('services', {} as any);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('update', () => {
    it('should update an existing record', async () => {
      const updates = { title: 'Updated Title' };
      const updatedService: Service = {
        id: '1',
        title: 'Updated Title',
        description: 'Description',
        icon: 'heart',
        features: ['feature1'],
        color_scheme: 'blue',
        published: true,
        sort_order: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
        created_by: null,
        updated_by: null,
      };

      vi.mocked(apiClient.apiClient.update).mockResolvedValue({
        data: updatedService,
        error: null,
        success: true,
      });

      const result = await ContentService.update<Service>('services', '1', updates);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedService);
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('services', '1', updates);
    });

    it('should handle update errors', async () => {
      const mockError = {
        message: 'Update failed',
        code: 'UPDATE_ERROR',
      };

      vi.mocked(apiClient.apiClient.update).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.update('services', '1', {});

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      vi.mocked(apiClient.apiClient.delete).mockResolvedValue({
        data: null,
        error: null,
        success: true,
      });

      const result = await ContentService.delete('services', '1');

      expect(result.success).toBe(true);
      expect(apiClient.apiClient.delete).toHaveBeenCalledWith('services', '1');
    });

    it('should handle delete errors', async () => {
      const mockError = {
        message: 'Delete failed',
        code: 'DELETE_ERROR',
      };

      vi.mocked(apiClient.apiClient.delete).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.delete('services', '1');

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('bulkUpdate', () => {
    it('should update multiple records', async () => {
      vi.mocked(apiClient.apiClient.bulkUpdate).mockResolvedValue({
        data: 3,
        error: null,
        success: true,
      });

      const result = await ContentService.bulkUpdate('services', ['1', '2', '3'], {
        published: true,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe(3);
      expect(apiClient.apiClient.bulkUpdate).toHaveBeenCalledWith(
        'services',
        ['1', '2', '3'],
        { published: true }
      );
    });

    it('should handle empty ID array', async () => {
      const result = await ContentService.bulkUpdate('services', [], { published: true });

      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
      expect(apiClient.apiClient.bulkUpdate).not.toHaveBeenCalled();
    });

    it('should handle bulk update errors', async () => {
      const mockError = {
        message: 'Bulk update failed',
        code: 'BULK_UPDATE_ERROR',
      };

      vi.mocked(apiClient.apiClient.bulkUpdate).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.bulkUpdate('services', ['1', '2'], {
        published: true,
      });

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple records', async () => {
      vi.mocked(apiClient.apiClient.bulkDelete).mockResolvedValue({
        data: 3,
        error: null,
        success: true,
      });

      const result = await ContentService.bulkDelete('services', ['1', '2', '3']);

      expect(result.success).toBe(true);
      expect(result.data).toBe(3);
      expect(apiClient.apiClient.bulkDelete).toHaveBeenCalledWith('services', ['1', '2', '3']);
    });

    it('should handle empty ID array', async () => {
      const result = await ContentService.bulkDelete('services', []);

      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
      expect(apiClient.apiClient.bulkDelete).not.toHaveBeenCalled();
    });

    it('should handle bulk delete errors', async () => {
      const mockError = {
        message: 'Bulk delete failed',
        code: 'BULK_DELETE_ERROR',
      };

      vi.mocked(apiClient.apiClient.bulkDelete).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.bulkDelete('services', ['1', '2']);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('updateOrder', () => {
    it('should update sort order for multiple items', async () => {
      vi.mocked(apiClient.apiClient.update).mockResolvedValue({
        data: {} as any,
        error: null,
        success: true,
      });

      const items = [
        { id: '1', sort_order: 0 },
        { id: '2', sort_order: 1 },
        { id: '3', sort_order: 2 },
      ];

      const result = await ContentService.updateOrder('services', items);

      expect(result.success).toBe(true);
      expect(apiClient.apiClient.update).toHaveBeenCalledTimes(3);
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('services', '1', {
        sort_order: 0,
      });
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('services', '2', {
        sort_order: 1,
      });
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('services', '3', {
        sort_order: 2,
      });
    });

    it('should handle empty items array', async () => {
      const result = await ContentService.updateOrder('services', []);

      expect(result.success).toBe(true);
      expect(apiClient.apiClient.update).not.toHaveBeenCalled();
    });

    it('should handle partial failures', async () => {
      const mockError = {
        message: 'Update failed',
        code: 'UPDATE_ERROR',
      };

      vi.mocked(apiClient.apiClient.update)
        .mockResolvedValueOnce({
          data: {} as any,
          error: null,
          success: true,
        })
        .mockResolvedValueOnce({
          data: null,
          error: mockError,
          success: false,
        });

      const items = [
        { id: '1', sort_order: 0 },
        { id: '2', sort_order: 1 },
      ];

      const result = await ContentService.updateOrder('services', items);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });
  });

  describe('retry logic', () => {
    it('should retry on network errors', async () => {
      const networkError = {
        message: 'Network error',
        code: 'NETWORK_ERROR',
      };

      vi.mocked(apiClient.apiClient.isNetworkError).mockReturnValue(true);
      vi.mocked(apiClient.apiClient.isAuthError).mockReturnValue(false);

      // Fail twice, then succeed
      vi.mocked(apiClient.apiClient.fetchAll)
        .mockResolvedValueOnce({
          data: null,
          error: networkError,
          success: false,
        })
        .mockResolvedValueOnce({
          data: null,
          error: networkError,
          success: false,
        })
        .mockResolvedValueOnce({
          data: [],
          error: null,
          success: true,
        });

      const result = await ContentService.getAll('services');

      expect(result.success).toBe(true);
      expect(apiClient.apiClient.fetchAll).toHaveBeenCalledTimes(3);
    });

    it('should not retry on auth errors', async () => {
      const authError = {
        message: 'Unauthorized',
        code: 'AUTH_ERROR',
      };

      vi.mocked(apiClient.apiClient.isAuthError).mockReturnValue(true);
      vi.mocked(apiClient.apiClient.isNetworkError).mockReturnValue(false);

      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: null,
        error: authError,
        success: false,
      });

      const result = await ContentService.getAll('services');

      expect(result.success).toBe(false);
      expect(apiClient.apiClient.fetchAll).toHaveBeenCalledTimes(1);
    });

    it('should not retry on non-network errors', async () => {
      const validationError = {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      };

      vi.mocked(apiClient.apiClient.isAuthError).mockReturnValue(false);
      vi.mocked(apiClient.apiClient.isNetworkError).mockReturnValue(false);

      vi.mocked(apiClient.apiClient.create).mockResolvedValue({
        data: null,
        error: validationError,
        success: false,
      });

      const result = await ContentService.create('services', {} as any);

      expect(result.success).toBe(false);
      expect(apiClient.apiClient.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getNextSortOrder', () => {
    it('should return 0 when no items exist', async () => {
      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: [],
        error: null,
        success: true,
      });

      const result = await ContentService.getNextSortOrder('contact_cards');

      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });

    it('should return max sort_order + 1 when items exist', async () => {
      const mockCards = [
        { id: '1', sort_order: 0 },
        { id: '2', sort_order: 1 },
        { id: '3', sort_order: 2 },
      ];

      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      const result = await ContentService.getNextSortOrder('contact_cards');

      expect(result.success).toBe(true);
      expect(result.data).toBe(3);
    });

    it('should handle non-sequential sort orders', async () => {
      const mockCards = [
        { id: '1', sort_order: 0 },
        { id: '2', sort_order: 5 },
        { id: '3', sort_order: 10 },
      ];

      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      const result = await ContentService.getNextSortOrder('contact_cards');

      expect(result.success).toBe(true);
      expect(result.data).toBe(11);
    });

    it('should handle fetch errors', async () => {
      const mockError = {
        message: 'Database error',
        code: 'DB_ERROR',
      };

      vi.mocked(apiClient.apiClient.fetchAll).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.getNextSortOrder('contact_cards');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('reorderCards', () => {
    const mockCards = [
      { id: '1', sort_order: 0, title: 'Card 1' },
      { id: '2', sort_order: 1, title: 'Card 2' },
      { id: '3', sort_order: 2, title: 'Card 3' },
    ];

    it('should move card up by swapping sort orders', async () => {
      vi.mocked(apiClient.apiClient.update).mockResolvedValue({
        data: {} as any,
        error: null,
        success: true,
      });

      const result = await ContentService.reorderCards(
        'contact_cards',
        '2',
        'up',
        mockCards
      );

      expect(result.success).toBe(true);
      expect(apiClient.apiClient.update).toHaveBeenCalledTimes(2);
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('contact_cards', '2', {
        sort_order: 0,
      });
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('contact_cards', '1', {
        sort_order: 1,
      });
    });

    it('should move card down by swapping sort orders', async () => {
      vi.mocked(apiClient.apiClient.update).mockResolvedValue({
        data: {} as any,
        error: null,
        success: true,
      });

      const result = await ContentService.reorderCards(
        'contact_cards',
        '2',
        'down',
        mockCards
      );

      expect(result.success).toBe(true);
      expect(apiClient.apiClient.update).toHaveBeenCalledTimes(2);
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('contact_cards', '2', {
        sort_order: 2,
      });
      expect(apiClient.apiClient.update).toHaveBeenCalledWith('contact_cards', '3', {
        sort_order: 1,
      });
    });

    it('should reject moving first card up', async () => {
      const result = await ContentService.reorderCards(
        'contact_cards',
        '1',
        'up',
        mockCards
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('ALREADY_FIRST');
      expect(apiClient.apiClient.update).not.toHaveBeenCalled();
    });

    it('should reject moving last card down', async () => {
      const result = await ContentService.reorderCards(
        'contact_cards',
        '3',
        'down',
        mockCards
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('ALREADY_LAST');
      expect(apiClient.apiClient.update).not.toHaveBeenCalled();
    });

    it('should handle card not found', async () => {
      const result = await ContentService.reorderCards(
        'contact_cards',
        '999',
        'up',
        mockCards
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CARD_NOT_FOUND');
      expect(apiClient.apiClient.update).not.toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      const mockError = {
        message: 'Update failed',
        code: 'UPDATE_ERROR',
      };

      vi.mocked(apiClient.apiClient.update).mockResolvedValue({
        data: null,
        error: mockError,
        success: false,
      });

      const result = await ContentService.reorderCards(
        'contact_cards',
        '2',
        'up',
        mockCards
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
