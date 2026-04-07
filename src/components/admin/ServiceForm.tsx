/**
 * ServiceForm Component
 * 
 * Form for creating and editing service offerings.
 * Supports validation, preview, and both create/edit modes.
 * 
 * Requirements: 2.2, 2.3, 2.5, 2.8
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, Eye } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import type { Service } from '@/types/admin-content';

// ============================================================================
// Types
// ============================================================================

export interface ServiceFormProps {
  /** Initial data for edit mode */
  initialData?: Service;
  /** Callback when form is submitted */
  onSubmit: (data: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form is submitting */
  submitting?: boolean;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  icon: string;
  features: string[];
  color_scheme: string;
  published: boolean;
  sort_order: number;
}

interface FormErrors {
  title?: string;
  description?: string;
  icon?: string;
  features?: string;
  color_scheme?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: ServiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    icon: initialData?.icon || '',
    features: initialData?.features || [],
    color_scheme: initialData?.color_scheme || 'blue',
    published: initialData?.published !== undefined ? initialData.published : true, // Default to true for new services
    sort_order: initialData?.sort_order || 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [newFeature, setNewFeature] = useState('');
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

    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon is required';
    }

    if (formData.features.length === 0) {
      newErrors.features = 'At least one feature is required';
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

  // Handle feature management
  const addFeature = () => {
    if (newFeature.trim()) {
      handleChange('features', [...formData.features, newFeature.trim()]);
      setNewFeature('');
      if (errors.features) {
        setErrors(prev => ({ ...prev, features: undefined }));
      }
    }
  };

  const removeFeature = (index: number) => {
    handleChange('features', formData.features.filter((_, i) => i !== index));
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
          <CardTitle>{initialData ? 'Edit Service' : 'Create Service'}</CardTitle>
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
              placeholder="e.g., Primary Care"
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
              placeholder="Describe the service..."
              rows={4}
              disabled={submitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Detailed Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Detailed Content
            </Label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
              placeholder="Write detailed content for the service detail page..."
            />
            <p className="text-xs text-muted-foreground">
              This content will appear on the service detail page
            </p>
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="icon">
              Icon <span className="text-destructive">*</span>
            </Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              placeholder="e.g., heart, stethoscope, pill"
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              Icon name from Lucide icons library
            </p>
            {errors.icon && (
              <p className="text-sm text-destructive">{errors.icon}</p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>
              Features <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                disabled={submitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                disabled={submitting || !newFeature.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      disabled={submitting}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.features && (
              <p className="text-sm text-destructive">{errors.features}</p>
            )}
          </div>

          {/* Color Scheme */}
          <div className="space-y-2">
            <Label htmlFor="color_scheme">Color Scheme</Label>
            <select
              id="color_scheme"
              value={formData.color_scheme}
              onChange={(e) => handleChange('color_scheme', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={submitting}
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Choose a color theme for the service card
            </p>
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
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label htmlFor="published" className="text-base font-semibold">
                Published {!formData.published && <span className="text-destructive">(Hidden from public)</span>}
              </Label>
              <p className="text-sm text-muted-foreground">
                {formData.published 
                  ? 'This service is visible on the public website' 
                  : 'This service is hidden and will NOT appear on the public website'}
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
            {submitting ? 'Saving...' : 'Save Service'}
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
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${
                    formData.color_scheme === 'blue' ? 'from-blue-500 to-blue-600' :
                    formData.color_scheme === 'green' ? 'from-green-500 to-green-600' :
                    formData.color_scheme === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                    formData.color_scheme === 'pink' ? 'from-pink-500 to-pink-600' :
                    formData.color_scheme === 'purple' ? 'from-purple-500 to-purple-600' :
                    formData.color_scheme === 'orange' ? 'from-orange-500 to-orange-600' :
                    'from-blue-500 to-blue-600'
                  }`}
                >
                  {formData.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{formData.title || 'Service Title'}</h3>
                  <p className="text-muted-foreground mb-4">
                    {formData.description || 'Service description will appear here...'}
                  </p>
                  {formData.features.length > 0 && (
                    <ul className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            formData.color_scheme === 'blue' ? 'bg-blue-500' :
                            formData.color_scheme === 'green' ? 'bg-green-500' :
                            formData.color_scheme === 'yellow' ? 'bg-yellow-500' :
                            formData.color_scheme === 'pink' ? 'bg-pink-500' :
                            formData.color_scheme === 'purple' ? 'bg-purple-500' :
                            formData.color_scheme === 'orange' ? 'bg-orange-500' :
                            'bg-blue-500'
                          }`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

export default ServiceForm;
