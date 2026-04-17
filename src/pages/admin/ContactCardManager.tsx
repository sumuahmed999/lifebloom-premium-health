/**
 * ContactCardManager Page
 * 
 * Admin page for managing contact cards.
 * Displays list of contact cards with CRUD operations, bulk actions, and reordering.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 5.1, 5.2, 5.3, 5.4, 5.6
 */

import { useState } from 'react';
import { ContactCardList } from '@/components/admin/ContactCardList';
import { ContactCardForm } from '@/components/admin/ContactCardForm';
import { Button } from '@/components/ui/button';
import { useContactCards } from '@/hooks/useContactCards';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { ContactCard, ContactCardFormData } from '@/types/admin-content';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ============================================================================
// Component
// ============================================================================

export function ContactCardManager() {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    cards,
    loading,
    createCard,
    updateCard,
    deleteCard,
    bulkPublish,
    bulkUnpublish,
    bulkDeleteCards,
    reorderCards,
  } = useContactCards();

  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<ContactCard | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Handle create
  const handleCreate = () => {
    setEditingCard(undefined);
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (card: ContactCard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteCard(deleteConfirmId);
      toast({
        title: 'Success',
        description: 'Contact card deleted successfully',
      });
      setDeleteConfirmId(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact card',
        variant: 'destructive',
      });
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string, status: boolean) => {
    try {
      await updateCard(id, { status: !status });
      toast({
        title: 'Success',
        description: `Card ${!status ? 'published' : 'unpublished'} successfully`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update card status',
        variant: 'destructive',
      });
    }
  };

  // Handle form submit
  const handleFormSubmit = async (data: ContactCardFormData) => {
    setSubmitting(true);
    try {
      if (editingCard) {
        await updateCard(editingCard.id, data);
        toast({
          title: 'Success',
          description: 'Contact card updated successfully',
        });
      } else {
        await createCard(data);
        toast({
          title: 'Success',
          description: 'Contact card created successfully',
        });
      }
      setShowForm(false);
      setEditingCard(undefined);
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${editingCard ? 'update' : 'create'} contact card`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle bulk publish
  const handleBulkPublish = async (ids: string[]) => {
    try {
      await bulkPublish(ids);
      toast({
        title: 'Success',
        description: `${ids.length} card${ids.length !== 1 ? 's' : ''} published`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to publish cards',
        variant: 'destructive',
      });
    }
  };

  // Handle bulk unpublish
  const handleBulkUnpublish = async (ids: string[]) => {
    try {
      await bulkUnpublish(ids);
      toast({
        title: 'Success',
        description: `${ids.length} card${ids.length !== 1 ? 's' : ''} unpublished`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish cards',
        variant: 'destructive',
      });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (ids: string[]) => {
    try {
      await bulkDeleteCards(ids);
      toast({
        title: 'Success',
        description: `${ids.length} card${ids.length !== 1 ? 's' : ''} deleted`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete cards',
        variant: 'destructive',
      });
    }
  };

  // Handle move up
  const handleMoveUp = async (card: ContactCard) => {
    const sortedCards = [...cards].sort((a, b) => a.sort_order - b.sort_order);
    const index = sortedCards.findIndex(c => c.id === card.id);
    
    if (index > 0) {
      const newCards = [...sortedCards];
      [newCards[index - 1], newCards[index]] = [newCards[index], newCards[index - 1]];
      
      // Update sort_order
      const reordered = newCards.map((c, i) => ({ ...c, sort_order: i }));
      
      try {
        await reorderCards(reordered);
        toast({
          title: 'Success',
          description: 'Card order updated',
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to update order',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle move down
  const handleMoveDown = async (card: ContactCard) => {
    const sortedCards = [...cards].sort((a, b) => a.sort_order - b.sort_order);
    const index = sortedCards.findIndex(c => c.id === card.id);
    
    if (index < sortedCards.length - 1) {
      const newCards = [...sortedCards];
      [newCards[index], newCards[index + 1]] = [newCards[index + 1], newCards[index]];
      
      // Update sort_order
      const reordered = newCards.map((c, i) => ({ ...c, sort_order: i }));
      
      try {
        await reorderCards(reordered);
        toast({
          title: 'Success',
          description: 'Card order updated',
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to update order',
          variant: 'destructive',
        });
      }
    }
  };

  // Check authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Please log in to access this page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Cards</h1>
          <p className="text-muted-foreground">
            Manage contact information cards for the Get in Touch section
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>

      {/* Contact Card List */}
      <ContactCardList
        cards={cards}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkDelete={handleBulkDelete}
      />

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? 'Edit Contact Card' : 'Create Contact Card'}
            </DialogTitle>
          </DialogHeader>
          <ContactCardForm
            initialData={editingCard}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingCard(undefined);
            }}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ContactCardManager;

