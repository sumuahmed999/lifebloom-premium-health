/**
 * useContactCards Hook
 * 
 * Custom hook for managing contact cards with convenience methods.
 * Wraps useContent hook with contact_cards table.
 * 
 * Requirements: 1.7, 2.2, 2.4, 2.6, 5.5
 */

import { useContent } from '@/hooks/useContent';
import type { ContactCard } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

export interface UseContactCardsOptions {
  /** Whether to fetch only published cards */
  publishedOnly?: boolean;
}

export interface UseContactCardsReturn {
  /** Array of contact cards */
  cards: ContactCard[];
  /** Loading state during fetch operations */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch cards from the server */
  refresh: () => Promise<void>;
  /** Create a new contact card */
  createCard: (data: Omit<ContactCard, 'id' | 'created_at' | 'updated_at'>) => Promise<ContactCard>;
  /** Update an existing contact card */
  updateCard: (id: string, data: Partial<ContactCard>) => Promise<ContactCard>;
  /** Delete a contact card */
  deleteCard: (id: string) => Promise<void>;
  /** Bulk publish cards */
  bulkPublish: (ids: string[]) => Promise<void>;
  /** Bulk unpublish cards */
  bulkUnpublish: (ids: string[]) => Promise<void>;
  /** Bulk delete cards */
  bulkDeleteCards: (ids: string[]) => Promise<void>;
  /** Reorder cards */
  reorderCards: (cards: ContactCard[]) => Promise<void>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for contact cards management
 * 
 * @param options - Optional configuration
 * @returns Contact cards management interface
 * 
 * @example
 * ```tsx
 * function ContactCardManager() {
 *   const { cards, loading, createCard, updateCard, deleteCard } = useContactCards();
 *   
 *   const handleCreate = async (data) => {
 *     await createCard(data);
 *     toast.success('Card created');
 *   };
 *   
 *   return <ContactCardList cards={cards} loading={loading} onCreate={handleCreate} />;
 * }
 * ```
 */
export function useContactCards(options: UseContactCardsOptions = {}): UseContactCardsReturn {
  const { publishedOnly = false } = options;

  const {
    items: cards,
    loading,
    error,
    refetch,
    create,
    update,
    delete: deleteItem,
    bulkUpdate,
    bulkDelete,
    reorder,
  } = useContent<ContactCard>('contact_cards', {
    filters: publishedOnly ? { status: true } : undefined,
  });

  /**
   * Bulk publish cards
   */
  const bulkPublish = async (ids: string[]): Promise<void> => {
    await bulkUpdate(ids, { status: true } as Partial<ContactCard>);
  };

  /**
   * Bulk unpublish cards
   */
  const bulkUnpublish = async (ids: string[]): Promise<void> => {
    await bulkUpdate(ids, { status: false } as Partial<ContactCard>);
  };

  return {
    cards,
    loading,
    error,
    refresh: refetch,
    createCard: create,
    updateCard: update,
    deleteCard: deleteItem,
    bulkPublish,
    bulkUnpublish,
    bulkDeleteCards: bulkDelete,
    reorderCards: reorder,
  };
}

export default useContactCards;
