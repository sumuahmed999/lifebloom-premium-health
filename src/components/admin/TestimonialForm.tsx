/**
 * TestimonialForm Component
 * 
 * Form for creating and editing customer testimonials.
 * Includes image upload, rating validation, and preview.
 * 
 * Requirements: 3.2, 3.3, 3.5, 3.8
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/ImageUploader';
import { Star, Save, Eye } from 'lucide-react';
import type { Testimonial } from '@/types/admin-content';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface TestimonialFormProps {
  /** Initial data for edit mode */
  initialData?: Testimonial;
  /** Callback when form is submitted */
  onSubmit: (data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form is submitting */
  submitting?: boolean;
}

interface FormData {
  customer_name: string;
  customer_role: string;
  image_url: string;
  rating: number;
  testimonial_text: string;
  published: boolean;
  sort_order: number;
}

interface FormErrors {
  customer_name?: string;
  rating?: string;
  testimonial_text?: string;
}

// ============================================================================
// Component
// ============================================================================

export function TestimonialForm({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: TestimonialFormProps) {
  const [formData, setFormData] = useState<FormData>({
    customer_name: initialData?.customer_name || '',
    customer_role: initialData?.customer_role || '',
    image_url: initialData?.image_url || '',
    rating: initialData?.rating || 5,
    testimonial_text: initialData?.testimonial_text || '',
    published: initialData?.published || false,
    sort_order: initialData?.sort_order || 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (!formData.testimonial_text.trim()) {
      newErrors.testimonial_text = 'Testimonial text is required';
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

  // Handle rating click
  const handleRatingClick = (rating: number) => {
    handleChange('rating', rating);
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
          <CardTitle>{initialData ? 'Edit Testimonial' : 'Create Testimonial'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer_name">
              Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              placeholder="e.g., John Smith"
              disabled={submitting}
            />
            {errors.customer_name && (
              <p className="text-sm text-destructive">{errors.customer_name}</p>
            )}
          </div>

          {/* Customer Role */}
          <div className="space-y-2">
            <Label htmlFor="customer_role">Customer Role</Label>
            <Input
              id="customer_role"
              value={formData.customer_role}
              onChange={(e) => handleChange('customer_role', e.target.value)}
              placeholder="e.g., Patient, Healthcare Professional"
              disabled={submitting}
            />
          </div>

          {/* Image Upload */}
          <ImageUploader
            label="Customer Photo"
            bucket="testimonials"
            currentImageUrl={formData.image_url}
            onUploadComplete={(url) => handleChange('image_url', url)}
          />

          {/* Rating */}
          <div className="space-y-2">
            <Label>
              Rating <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  disabled={submitting}
                  className="focus:outline-none"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">
                {formData.rating} / 5
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating}</p>
            )}
          </div>

          {/* Testimonial Text */}
          <div className="space-y-2">
            <Label htmlFor="testimonial_text">
              Testimonial <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="testimonial_text"
              value={formData.testimonial_text}
              onChange={(e) => handleChange('testimonial_text', e.target.value)}
              placeholder="Enter the customer's testimonial..."
              rows={6}
              disabled={submitting}
            />
            {errors.testimonial_text && (
              <p className="text-sm text-destructive">{errors.testimonial_text}</p>
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
                Make this testimonial visible on the website
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
            {submitting ? 'Saving...' : 'Save Testimonial'}
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
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-start gap-4">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt={formData.customer_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">
                      {formData.customer_name || 'Customer Name'}
                    </h4>
                    {formData.customer_role && (
                      <span className="text-sm text-muted-foreground">
                        • {formData.customer_role}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-4 w-4',
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{formData.testimonial_text || 'Testimonial text will appear here...'}"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

export default TestimonialForm;
