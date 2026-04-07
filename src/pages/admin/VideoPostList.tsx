/**
 * VideoPostList Page
 * 
 * Admin page for managing video posts.
 * Displays list of videos with CRUD operations, category filtering, and bulk actions.
 * 
 * Requirements: 5.1, 7.6, 8.2, 8.3, 8.4, 8.5
 */

import { useState } from 'react';
import { ContentList, type ContentListColumn } from '@/components/ContentList';
import { VideoPostForm } from '@/components/admin/VideoPostForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/use-toast';
import type { VideoPost } from '@/types/admin-content';
import { Plus, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ============================================================================
// Component
// ============================================================================

export function VideoPostList() {
  const { toast } = useToast();
  const {
    items: videoPosts,
    loading,
    create,
    update,
    delete: deleteVideoPost,
    bulkUpdate,
    bulkDelete,
    reorder,
  } = useContent<VideoPost>('videos');

  const [showForm, setShowForm] = useState(false);
  const [editingVideoPost, setEditingVideoPost] = useState<VideoPost | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Extract unique categories from video posts
  const categories = Array.from(new Set(videoPosts.map(post => post.category).filter(Boolean)));

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Define columns for the content list
  const columns: ContentListColumn<VideoPost>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (post) => (
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
            {post.thumbnail_url ? (
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{post.title}</p>
            <p className="text-sm text-muted-foreground truncate max-w-md">
              {post.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (post) => (
        <Badge variant="outline">{post.category}</Badge>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (post) => (
        <span className="text-sm text-muted-foreground">
          {formatDuration(post.duration)}
        </span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      render: (post) => (
        <Badge variant={post.published ? 'default' : 'secondary'}>
          {post.published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
  ];

  // Handle create
  const handleCreate = () => {
    setEditingVideoPost(undefined);
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (post: VideoPost) => {
    setEditingVideoPost(post);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteVideoPost(id);
      toast({
        title: 'Success',
        description: 'Video post deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete video post',
        variant: 'destructive',
      });
    }
  };

  // Handle form submit
  const handleFormSubmit = async (
    data: Omit<VideoPost, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
  ) => {
    setSubmitting(true);
    try {
      if (editingVideoPost) {
        await update(editingVideoPost.id, data);
        toast({
          title: 'Success',
          description: 'Video post updated successfully',
        });
      } else {
        await create(data);
        toast({
          title: 'Success',
          description: 'Video post created successfully',
        });
      }
      setShowForm(false);
      setEditingVideoPost(undefined);
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${editingVideoPost ? 'update' : 'create'} video post`,
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
        description: `${ids.length} video post${ids.length !== 1 ? 's' : ''} published`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to publish video posts',
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
        description: `${ids.length} video post${ids.length !== 1 ? 's' : ''} unpublished`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish video posts',
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
        description: `${ids.length} video post${ids.length !== 1 ? 's' : ''} deleted`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete video posts',
        variant: 'destructive',
      });
    }
  };

  // Handle move up
  const handleMoveUp = async (post: VideoPost) => {
    const index = videoPosts.findIndex(p => p.id === post.id);
    if (index > 0) {
      const newPosts = [...videoPosts];
      [newPosts[index - 1], newPosts[index]] = [newPosts[index], newPosts[index - 1]];
      const reordered = newPosts.map((p, i) => ({ ...p, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Video post order updated',
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
  const handleMoveDown = async (post: VideoPost) => {
    const index = videoPosts.findIndex(p => p.id === post.id);
    if (index < videoPosts.length - 1) {
      const newPosts = [...videoPosts];
      [newPosts[index], newPosts[index + 1]] = [newPosts[index + 1], newPosts[index]];
      const reordered = newPosts.map((p, i) => ({ ...p, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Video post order updated',
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
          <h1 className="text-3xl font-bold">Video Posts</h1>
          <p className="text-muted-foreground">
            Manage video content and multimedia
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video Post
        </Button>
      </div>

      {/* Content List */}
      <ContentList
        items={videoPosts}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search video posts..."
        showCategoryFilter
        categories={categories}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVideoPost ? 'Edit Video Post' : 'Create Video Post'}
            </DialogTitle>
          </DialogHeader>
          <VideoPostForm
            initialData={editingVideoPost}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingVideoPost(undefined);
            }}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VideoPostList;
