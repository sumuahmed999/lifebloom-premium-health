/**
 * BlogPostList Page
 * 
 * Admin page for managing blog posts.
 * Displays list of blog posts with CRUD operations, category filtering, and bulk actions.
 * 
 * Requirements: 4.1, 7.6, 8.2, 8.3, 8.4, 8.5
 */

import { useState } from 'react';
import { ContentList, type ContentListColumn } from '@/components/ContentList';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/types/admin-content';
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

export function BlogPostList() {
  const { toast } = useToast();
  const {
    items: blogPosts,
    loading,
    create,
    update,
    delete: deleteBlogPost,
    bulkUpdate,
    bulkDelete,
    reorder,
  } = useContent<BlogPost>('blogs');

  const [showForm, setShowForm] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Extract unique categories from blog posts
  const categories = Array.from(new Set(blogPosts.map(post => post.category).filter(Boolean)));

  // Define columns for the content list
  const columns: ContentListColumn<BlogPost>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (post) => (
        <div>
          <p className="font-medium">{post.title}</p>
          <p className="text-sm text-muted-foreground truncate max-w-md">
            {post.excerpt}
          </p>
        </div>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      render: (post) => (
        <span className="text-sm">{post.author}</span>
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
      key: 'read_time',
      label: 'Read Time',
      render: (post) => (
        <span className="text-sm text-muted-foreground">{post.read_time} min</span>
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
    setEditingBlogPost(undefined);
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (post: BlogPost) => {
    setEditingBlogPost(post);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteBlogPost(id);
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  // Handle form submit
  const handleFormSubmit = async (
    data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
  ) => {
    setSubmitting(true);
    try {
      if (editingBlogPost) {
        await update(editingBlogPost.id, data);
        toast({
          title: 'Success',
          description: 'Blog post updated successfully',
        });
      } else {
        await create(data);
        toast({
          title: 'Success',
          description: 'Blog post created successfully',
        });
      }
      setShowForm(false);
      setEditingBlogPost(undefined);
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${editingBlogPost ? 'update' : 'create'} blog post`,
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
        description: `${ids.length} blog post${ids.length !== 1 ? 's' : ''} published`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to publish blog posts',
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
        description: `${ids.length} blog post${ids.length !== 1 ? 's' : ''} unpublished`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unpublish blog posts',
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
        description: `${ids.length} blog post${ids.length !== 1 ? 's' : ''} deleted`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog posts',
        variant: 'destructive',
      });
    }
  };

  // Handle move up
  const handleMoveUp = async (post: BlogPost) => {
    const index = blogPosts.findIndex(p => p.id === post.id);
    if (index > 0) {
      const newPosts = [...blogPosts];
      [newPosts[index - 1], newPosts[index]] = [newPosts[index], newPosts[index - 1]];
      const reordered = newPosts.map((p, i) => ({ ...p, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Blog post order updated',
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
  const handleMoveDown = async (post: BlogPost) => {
    const index = blogPosts.findIndex(p => p.id === post.id);
    if (index < blogPosts.length - 1) {
      const newPosts = [...blogPosts];
      [newPosts[index], newPosts[index + 1]] = [newPosts[index + 1], newPosts[index]];
      const reordered = newPosts.map((p, i) => ({ ...p, sort_order: i }));
      try {
        await reorder(reordered);
        toast({
          title: 'Success',
          description: 'Blog post order updated',
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
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage blog articles and content
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      {/* Content List */}
      <ContentList
        items={blogPosts}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search blog posts..."
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlogPost ? 'Edit Blog Post' : 'Create Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <BlogPostForm
            initialData={editingBlogPost}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBlogPost(undefined);
            }}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BlogPostList;
