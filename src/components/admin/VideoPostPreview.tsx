/**
 * VideoPostPreview Component
 * 
 * Preview component for video posts showing how they will appear on the public site.
 * Displays in a modal overlay with close functionality.
 * 
 * Requirements: 9.1, 9.2, 9.4, 9.7
 */

import { Button } from '@/components/ui/button';
import { Play, Calendar, Clock } from 'lucide-react';
import type { VideoPost } from '@/types/admin-content';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ============================================================================
// Types
// ============================================================================

export interface VideoPostPreviewProps {
  /** Video post to preview */
  post: VideoPost;
  /** Whether the preview is open */
  open: boolean;
  /** Callback when preview is closed */
  onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function VideoPostPreview({ post, open, onClose }: VideoPostPreviewProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Video Post Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Thumbnail */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
            {post.thumbnail_url ? (
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
            {/* Duration Badge */}
            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium">
              {formatDuration(post.duration)}
            </div>
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Play className="h-10 w-10 text-white ml-1" />
              </div>
            </div>
          </div>

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
          <h1 className="text-3xl font-bold leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(post.duration)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">About this video</h2>
            <p className="text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Video Source</h2>
            <a
              href={post.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {post.video_url}
            </a>
          </div>

          {/* Divider */}
          <hr className="border-t" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Last updated: {formatDate(post.updated_at)}
            </div>
            <Button onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VideoPostPreview;
