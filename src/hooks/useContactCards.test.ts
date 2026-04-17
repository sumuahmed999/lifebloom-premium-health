/**
 * useContactCards Hook Tests
 * 
 * Tests for the useContactCards hook functionality.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContactCards } from './useContactCards';
import { ContentService } from '@/lib/services/ContentService';
import type { ContactCard } from '@/types/admin-content';

// Mock ContentService
vi.mock('@/lib/services/ContentService', () => ({
  ContentService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    bulkUpdate: vi.fn(),
    bulkDelete: vi.fn(),
    updateOrder: vi.fn(),
  },
}));

describe('useContactCards', () => {
  const mockCards: ContactCard[] = [
    {
      id: '1',
      icon: 'Phone',
      title: 'Call Us',
      short_description: 'Give us a call',
      detailed_content: '<p>Call us at 555-1234</p>',
      cta_button_text: 'Call Now',
      cta_link: 'tel:+15551234',
      color_theme: 'primary-blue',
      status: true,
      sort_order: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      icon: 'Mail',
      title: 'Email Us',
      short_description: 'Send us an email',
      detailed_content: '<p>Email us at info@example.com</p>',
      cta_button_text: 'Send Email',
      cta_link: 'mailto:info@example.com',
      color_theme: 'secondary-green',
      status: false,
      sort_order: 1,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should fetch all cards on mount', async () => {
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.cards).toEqual(mockCards);
      expect(result.current.error).toBeNull();
      expect(ContentService.getAll).toHaveBeenCalledWith('contact_cards', {
        filters: undefined,
      });
    });

    it('should fetch only published cards when publishedOnly is true', async () => {
      const publishedCards = mockCards.filter(card => card.status);
      
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: publishedCards,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards({ publishedOnly: true }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(ContentService.getAll).toHaveBeenCalledWith('contact_cards', {
        filters: { status: true },
      });
    });

    it('should handle loading state', () => {
      vi.mocked(ContentService.getAll).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useContactCards());

      expect(result.current.loading).toBe(true);
      expect(result.current.cards).toEqual([]);
    });

    it('should handle error state', async () => {
      const error = { message: 'Failed to fetch', code: 'FETCH_ERROR' };
      
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: null,
        error,
        success: false,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(new Error('Failed to fetch'));
      expect(result.current.cards).toEqual([]);
    });
  });

  describe('CRUD operations', () => {
    it('should create a new card', async () => {
      const newCard: Omit<ContactCard, 'id' | 'created_at' | 'updated_at'> = {
        icon: 'MapPin',
        title: 'Visit Us',
        short_description: 'Come visit our office',
        detailed_content: '<p>123 Main St</p>',
        cta_button_text: 'Get Directions',
        cta_link: 'https://maps.google.com',
        color_theme: 'accent-teal',
        status: true,
        sort_order: 2,
      };

      const createdCard: ContactCard = {
        ...newCard,
        id: '3',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      };

      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      vi.mocked(ContentService.create).mockResolvedValue({
        data: createdCard,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const created = await result.current.createCard(newCard);

      expect(created).toEqual(createdCard);
      expect(ContentService.create).toHaveBeenCalledWith('contact_cards', newCard);
    });

    it('should update an existing card', async () => {
      const updates: Partial<ContactCard> = {
        title: 'Updated Title',
        status: false,
      };

      const updatedCard: ContactCard = {
        ...mockCards[0],
        ...updates,
        updated_at: '2024-01-04T00:00:00Z',
      };

      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      vi.mocked(ContentService.update).mockResolvedValue({
        data: updatedCard,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updated = await result.current.updateCard('1', updates);

      expect(updated).toEqual(updatedCard);
      expect(ContentService.update).toHaveBeenCalledWith('contact_cards', '1', updates);
    });

    it('should delete a card', async () => {
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      vi.mocked(ContentService.delete).mockResolvedValue({
        data: null,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteCard('1');

      expect(ContentService.delete).toHaveBeenCalledWith('contact_cards', '1');
    });
  });

  describe('Bulk operations', () => {
    it('should bulk publish cards', async () => {
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      vi.mocked(ContentService.bulkUpdate).mockResolvedValue({
        data: 2,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.bulkPublish(['1', '2']);

      expect(ContentService.bulkUpdate).toHaveBeenCalledWith(
        'contact_cards',
        ['1', '2'],
        { status: true }
      );
    });

    it('should bulk unpublish cards', async () => {
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      vi.mocked(ContentService.bulkUpdate).mockResolvedValue({
        data: 2,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.bulkUnpublish(['1', '2']);

      expect(ContentService.bulkUpdate).toHaveBeenCalledWith(
        'contact_cards',
        ['1', '2'],
        { status: false }
      );
    });

    it('should bulk delete cards', async () => {
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      vi.mocked(ContentService.bulkDelete).mockResolvedValue({
        data: 2,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.bulkDeleteCards(['1', '2']);

      expect(ContentService.bulkDelete).toHaveBeenCalledWith('contact_cards', ['1', '2']);
    });
  });

  describe('Reordering', () => {
    it('should reorder cards', async () => {
      const reorderedCards = [mockCards[1], mockCards[0]];

      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      vi.mocked(ContentService.updateOrder).mockResolvedValue({
        data: null,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.reorderCards(reorderedCards);

      expect(ContentService.updateOrder).toHaveBeenCalledWith('contact_cards', [
        { id: '2', sort_order: 0 },
        { id: '1', sort_order: 1 },
      ]);
    });
  });

  describe('Refresh', () => {
    it('should refetch cards when refresh is called', async () => {
      vi.mocked(ContentService.getAll).mockResolvedValue({
        data: mockCards,
        error: null,
        success: true,
      });

      const { result } = renderHook(() => useContactCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(ContentService.getAll).toHaveBeenCalledTimes(1);

      await result.current.refresh();

      expect(ContentService.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
