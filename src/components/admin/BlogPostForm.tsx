/**
 * BlogPostForm Component
 * 
 * Form for creating and editing blog posts.
 * Includes rich text editor, image upload, and draft/publish toggle.
 * 
 * Requirements: 4.2, 4.3, 4.5, 4.7, 4.10, 4.11
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/ImageUploader';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Save, Eye } from 'lucide-react';
import type { BlogPost } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

export interface BlogPostFormProps {
  /** Initial data for edit mode */
  initialData?: BlogPost;
  /** Callback when form is submitted */
  onSubmit: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form is submitting */
  submitting?: boolean;
}

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string;
  category: string;
  read_time: number;
  published: boolean;
  sort_order: number;
}

interface FormErrors {
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  read_time?: string;
}

// Common blog categories
const BLOG_CATEGORIES = [
  'Health Tips',
  'Wellness',
  'Nutrition',
  'Mental Health',
  'Fitness',
  'Medical News',
  'Patient Stories',
  'Prevention',
];

// ============================================================================
// Component
// ============================================================================

export function BlogPostForm({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: BlogPostFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    author: initialData?.author || '',
    image_url: initialData?.image_url || '',
    category: initialData?.category || '',
    read_time: initialData?.read_time || 5,
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

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.read_time <= 0) {
      newErrors.read_time = 'Read time must be greater than 0';
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
          <CardTitle>{initialData ? 'Edit Blog Post' : 'Create Blog Post'}</CardTitle>
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
              placeholder="Enter blog post title..."
              disabled={submitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">
              Excerpt <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Brief summary of the blog post..."
              rows={3}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              {formData.excerpt.length} characters
            </p>
            {errors.excerpt && (
              <p className="text-sm text-destructive">{errors.excerpt}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <RichTextEditor
              label="Content"
              required
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
              placeholder="Write your blog post content..."
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">
              Author <span className="text-destructive">*</span>
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Author name..."
              disabled={submitting}
            />
            {errors.author && (
              <p className="text-sm text-destructive">{errors.author}</p>
            )}
          </div>

          {/* Featured Image */}
          <ImageUploader
            label="Featured Image"
            bucket="blogs"
            currentImageUrl={formData.image_url}
            onUploadComplete={(url) => handleChange('image_url', url)}
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
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {BLOG_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Read Time */}
          <div className="space-y-2">
            <Label htmlFor="read_time">
              Read Time (minutes) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="read_time"
              type="number"
              min="1"
              value={formData.read_time}
              onChange={(e) => handleChange('read_time', parseInt(e.target.value) || 0)}
              disabled={submitting}
            />
            {errors.read_time && (
              <p className="text-sm text-destructive">{errors.read_time}</p>
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
                  ? 'This post is visible on the website' 
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
            <article className="prose prose-sm max-w-none">
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>{formData.category || 'Uncategorized'}</span>
                <span>•</span>
                <span>{formData.read_time} min read</span>
                <span>•</span>
                <span>By {formData.author || 'Unknown'}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {formData.title || 'Blog Post Title'}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {formData.excerpt || 'Blog post excerpt will appear here...'}
              </p>
              <div className="whitespace-pre-wrap">
                {formData.content || 'Blog post content will appear here...'}
              </div>
            </article>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

export default BlogPostForm;
