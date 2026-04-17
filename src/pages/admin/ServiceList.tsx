/**
 * ServiceList Page
 * 
 * Admin page for managing service offerings.
 * Displays list of services with CRUD operations and bulk actions.
 * 
 * Requirements: 2.1, 8.2, 8.3, 8.4, 8.5
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentList, type ContentListColumn } from '@/components/ContentList';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/use-toast';
import type { Service } from '@/types/admin-content';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ============================================================================
// Component
// ============================================================================

export function ServiceList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items: services,
    loading,
    create,
    update,
    delete: deleteService,
    bulkUpdate,
    bulkDelete,
    reorder,
  } = useContent<Service>('services');

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Define columns for the content list
  const columns: ContentListColumn<Service>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (service) => (
        <div>
          <p className="font-medium">{service.title}</p>
          <p className="text-sm text-muted-foreground truncate max-w-md">
            {service.description}
          </p>
        </div>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      render: (service) => (
        <Badge variant="outline">{service.icon}</Badge>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      render: (service) => (
        <span className="text-sm text-muted-foreground">
          {service.features.length} feature{service.features.length !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      render: (service) => (
        <Badge variant={service.published ? 'default' : 'secondary'}>
          {service.published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
  ];

  // Handle create
  const handleCreate = () => {
    setEditingService(undefined);
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      });
    }
  };

  // Handle form submit
  const handleFormSubmit = async (
    data: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
  ) => {
    setSubmitting(true);
    try {
      if (editingService) {
        await update(editingService.id, data);
        toast({
          title: 'Success',
          description: 'Service updated successfully',
        });
      } else {
        await create(data);
        toast({
          title: 'Success',
          description: 'Service created successfully',
        });
      }
      setShowForm(false);
      setEditingService(undefined);
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${editingService ? 'update' : 'create'} service`,
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
        description: `${ids.length} service${ids.length !== 1 ? 's' : ''} published`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to publish services',
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
        description: `${ids.length} service${ids.length !== 1 ? 's' : ''} unpublished`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish services',
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
        description: `${ids.length} service${ids.length !== 1 ? 's' : ''} deleted`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete services',
        variant: 'destructive',
      });
    }
  };

  // Handle move up
  const handleMoveUp = async (service: Service) => {
    const index = services.findIndex(s => s.id === service.id);
    if (index > 0) {
      const newServices = [...services];
      [newServices[index - 1], newServices[index]] = [newServices[index], newServices[index - 1]];
      // Update sort_order
      const reordered = newServices.map((s, i) => ({ ...s, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Service order updated',
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
  const handleMoveDown = async (service: Service) => {
    const index = services.findIndex(s => s.id === service.id);
    if (index < services.length - 1) {
      const newServices = [...services];
      [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
      // Update sort_order
      const reordered = newServices.map((s, i) => ({ ...s, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Service order updated',
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
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage healthcare service offerings
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Content List */}
      <ContentList
        items={services}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search services..."
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
              {editingService ? 'Edit Service' : 'Create Service'}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            initialData={editingService}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingService(undefined);
            }}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ServiceList;

