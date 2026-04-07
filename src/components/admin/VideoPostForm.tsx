/**
 * VideoPostForm Component
 * 
 * Form for creating and editing video posts.
 * Includes thumbnail upload, duration validation, and draft/publish toggle.
 * 
 * Requirements: 5.2, 5.3, 5.5, 5.7, 5.10, 5.11
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/ImageUploader';
import { Save, Eye, Play } from 'lucide-react';
import type { VideoPost } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

export interface VideoPostFormProps {
  /** Initial data for edit mode */
  initialData?: VideoPost;
  /** Callback when form is submitted */
  onSubmit: (data: Omit<VideoPost, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form is submitting */
  submitting?: boolean;
}

interface FormData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  duration: number;
  published: boolean;
  sort_order: number;
}

interface FormErrors {
  title?: string;
  description?: string;
  video_url?: string;
  category?: string;
  duration?: string;
}

// Common video categories
const VIDEO_CATEGORIES = [
  'Health Education',
  'Exercise & Fitness',
  'Nutrition Tips',
  'Mental Wellness',
  'Patient Testimonials',
  'Medical Procedures',
  'Preventive Care',
  'Wellness Tips',
];

// ============================================================================
// Component
// ============================================================================

export function VideoPostForm({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: VideoPostFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    video_url: initialData?.video_url || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    category: initialData?.category || '',
    duration: initialData?.duration || 0,
    published: initialData?.published || false,
    sort_order: initialData?.sort_order || 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.video_url.trim()) {
      newErrors.video_url = 'Video URL is required';
    } else {
      // Basic URL validation
      try {
        new URL(formData.video_url);
      } catch {
        newErrors.video_url = 'Please enter a valid URL';
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Video Post' : 'Create Video Post'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter video title..."
              disabled={submitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the video content..."
              rows={4}
              disabled={submitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="video_url">
              Video URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => handleChange('video_url', e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              YouTube, Vimeo, or direct video URL
            </p>
            {errors.video_url && (
              <p className="text-sm text-destructive">{errors.video_url}</p>
            )}
          </div>

          {/* Thumbnail Upload */}
          <ImageUploader
            label="Thumbnail Image"
            bucket="videos"
            currentImageUrl={formData.thumbnail_url}
            onUploadComplete={(url) => handleChange('thumbnail_url', url)}
          />

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Enter or select category..."
                disabled={submitting}
                list="video-category-suggestions"
              />
              <datalist id="video-category-suggestions">
                {VIDEO_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">
              Duration (seconds) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              {formData.duration > 0 ? `Formatted: ${formatDuration(formData.duration)}` : 'Enter duration in seconds'}
            </p>
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration}</p>
            )}
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first
            </p>
          </div>

          {/* Published */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="published">Published</Label>
              <p className="text-xs text-muted-foreground">
                {formData.published 
                  ? 'This video is visible on the website' 
                  : 'Save as draft (not visible on website)'}
              </p>
            </div>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleChange('published', checked)}
              disabled={submitting}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          disabled={submitting}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showPreview ? 'Hide' : 'Show'} Preview
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Saving...' : formData.published ? 'Publish' : 'Save Draft'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Thumbnail */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                {formData.thumbnail_url ? (
                  <img
                    src={formData.thumbnail_url}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                  {formatDuration(formData.duration)}
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                  {formData.category || 'Uncategorized'}
                </span>
                <span>•</span>
                <span>{formatDuration(formData.duration)}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold">
                {formData.title || 'Video Title'}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground">
                {formData.description || 'Video description will appear here...'}
              </p>

              {/* Video URL */}
              {formData.video_url && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Video URL: </span>
                  <a
                    href={formData.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {formData.video_url}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

export default VideoPostForm;
