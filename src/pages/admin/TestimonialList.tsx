/**
 * TestimonialList Page
 * 
 * Admin page for managing customer testimonials.
 * Displays list of testimonials with CRUD operations and bulk actions.
 * 
 * Requirements: 3.1, 8.2, 8.3, 8.4, 8.5
 */

import { useState } from 'react';
import { ContentList, type ContentListColumn } from '@/components/ContentList';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/use-toast';
import type { Testimonial } from '@/types/admin-content';
import { Plus, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ============================================================================
// Component
// ============================================================================

export function TestimonialList() {
  const { toast } = useToast();
  const {
    items: testimonials,
    loading,
    create,
    update,
    delete: deleteTestimonial,
    bulkUpdate,
    bulkDelete,
    reorder,
  } = useContent<Testimonial>('testimonials');

  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Define columns for the content list
  const columns: ContentListColumn<Testimonial>[] = [
    {
      key: 'customer_name',
      label: 'Customer',
      render: (testimonial) => (
        <div className="flex items-center gap-3">
          {testimonial.image_url && (
            <img
              src={testimonial.image_url}
              alt={testimonial.customer_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium">{testimonial.customer_name}</p>
            {testimonial.customer_role && (
              <p className="text-sm text-muted-foreground">{testimonial.customer_role}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (testimonial) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'h-4 w-4',
                star <= testimonial.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            {testimonial.rating}/5
          </span>
        </div>
      ),
    },
    {
      key: 'testimonial_text',
      label: 'Testimonial',
      render: (testimonial) => (
        <p className="text-sm text-muted-foreground truncate max-w-md">
          {testimonial.testimonial_text}
        </p>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      render: (testimonial) => (
        <Badge variant={testimonial.published ? 'default' : 'secondary'}>
          {testimonial.published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
  ];

  // Handle create
  const handleCreate = () => {
    setEditingTestimonial(undefined);
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    }
  };

  // Handle form submit
  const handleFormSubmit = async (
    data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
  ) => {
    setSubmitting(true);
    try {
      if (editingTestimonial) {
        await update(editingTestimonial.id, data);
        toast({
          title: 'Success',
          description: 'Testimonial updated successfully',
        });
      } else {
        await create(data);
        toast({
          title: 'Success',
          description: 'Testimonial created successfully',
        });
      }
      setShowForm(false);
      setEditingTestimonial(undefined);
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${editingTestimonial ? 'update' : 'create'} testimonial`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle bulk publish
  const handleBulkPublish = async (ids: string[]) => {
    try {
      await bulkUpdate(ids, { published: true });
      toast({
        title: 'Success',
        description: `${ids.length} testimonial${ids.length !== 1 ? 's' : ''} published`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to publish testimonials',
        variant: 'destructive',
      });
    }
  };

  // Handle bulk unpublish
  const handleBulkUnpublish = async (ids: string[]) => {
    try {
      await bulkUpdate(ids, { published: false });
      toast({
        title: 'Success',
        description: `${ids.length} testimonial${ids.length !== 1 ? 's' : ''} unpublished`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish testimonials',
        variant: 'destructive',
      });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (ids: string[]) => {
    try {
      await bulkDelete(ids);
      toast({
        title: 'Success',
        description: `${ids.length} testimonial${ids.length !== 1 ? 's' : ''} deleted`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonials',
        variant: 'destructive',
      });
    }
  };

  // Handle move up
  const handleMoveUp = async (testimonial: Testimonial) => {
    const index = testimonials.findIndex(t => t.id === testimonial.id);
    if (index > 0) {
      const newTestimonials = [...testimonials];
      [newTestimonials[index - 1], newTestimonials[index]] = [newTestimonials[index], newTestimonials[index - 1]];
      const reordered = newTestimonials.map((t, i) => ({ ...t, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Testimonial order updated',
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
  const handleMoveDown = async (testimonial: Testimonial) => {
    const index = testimonials.findIndex(t => t.id === testimonial.id);
    if (index < testimonials.length - 1) {
      const newTestimonials = [...testimonials];
      [newTestimonials[index], newTestimonials[index + 1]] = [newTestimonials[index + 1], newTestimonials[index]];
      const reordered = newTestimonials.map((t, i) => ({ ...t, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Testimonial order updated',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer reviews and feedback
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Content List */}
      <ContentList
        items={testimonials}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search testimonials..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkPublish={handleBulkPublish}
        onBulkUnpublish={handleBulkUnpublish}
        onBulkDelete={handleBulkDelete}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        showReordering
      />

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}
            </DialogTitle>
          </DialogHeader>
          <TestimonialForm
            initialData={editingTestimonial}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingTestimonial(undefined);
            }}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TestimonialList;

