/**
 * BlogPostPreview Component
 * 
 * Preview component for blog posts showing how they will appear on the public site.
 * Displays in a modal overlay with close functionality.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.7
 */

import { Button } from '@/components/ui/button';
import { X, Calendar, Clock, User } from 'lucide-react';
import type { BlogPost } from '@/types/admin-content';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ============================================================================
// Types
// ============================================================================

export interface BlogPostPreviewProps {
  /** Blog post to preview */
  post: BlogPost;
  /** Whether the preview is open */
  open: boolean;
  /** Callback when preview is closed */
  onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function BlogPostPreview({ post, open, onClose }: BlogPostPreviewProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Blog Post Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {post.image_url && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {post.category}
            </span>
            {!post.published && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Draft
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.read_time} min read</span>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Divider */}
          <hr className="border-t" />

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </article>

          {/* Footer */}
          <div className="pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(post.updated_at)}
              </div>
              <Button onClick={onClose}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BlogPostPreview;
