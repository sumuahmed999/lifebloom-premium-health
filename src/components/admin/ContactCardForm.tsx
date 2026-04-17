/**
 * ContactCardForm Component
 * 
 * Form for creating and editing contact cards with live preview.
 * Features two-column layout with form on left and live preview on right.
 * Includes real-time validation, character counters, and responsive design.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 4.1, 4.2, 4.5, 4.6
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Save, Eye, EyeOff } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { IconPicker } from '@/components/admin/IconPicker';
import { ColorThemeSelector } from '@/components/admin/ColorThemeSelector';
import { LivePreview } from '@/components/admin/LivePreview';
import { ContentService } from '@/lib/services/ContentService';
import type { ContactCard, ContactCardFormData, ContactCardValidationErrors } from '@/types/admin-content';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface ContactCardFormProps {
  /** Initial data for edit mode */
  initialData?: ContactCard;
  /** Callback when form is submitted */
  onSubmit: (data: ContactCardFormData) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form is submitting */
  submitting?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get character count color based on usage percentage
 */
function getCharCountColor(current: number, max: number): string {
  const percentage = (current / max) * 100;
  if (percentage >= 100) return 'text-destructive';
  if (percentage >= 80) return 'text-orange-500';
  return 'text-muted-foreground';
}

// ============================================================================
// Component
// ============================================================================

export function ContactCardForm({
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
}: ContactCardFormProps) {
  // Form state
  const [formData, setFormData] = useState<ContactCardFormData>({
    icon: initialData?.icon || 'Phone',
    title: initialData?.title || '',
    short_description: initialData?.short_description || '',
    detailed_content: initialData?.detailed_content || '',
    cta_button_text: initialData?.cta_button_text || '',
    cta_link: initialData?.cta_link || '',
    color_theme: initialData?.color_theme || 'primary-blue',
    status: initialData?.status || false,
    sort_order: initialData?.sort_order || 0,
  });

  const [errors, setErrors] = useState<ContactCardValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-assign sort_order for new cards
  useEffect(() => {
    if (!initialData) {
      // This is a new card, fetch next sort_order
      const fetchNextSortOrder = async () => {
        const response = await ContentService.getNextSortOrder('contact_cards');
        if (response.success && response.data !== null) {
          setFormData(prev => ({ ...prev, sort_order: response.data! }));
        }
      };
      fetchNextSortOrder();
    }
  }, [initialData]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify({
      icon: initialData?.icon || 'Phone',
      title: initialData?.title || '',
      short_description: initialData?.short_description || '',
      detailed_content: initialData?.detailed_content || '',
      cta_button_text: initialData?.cta_button_text || '',
      cta_link: initialData?.cta_link || '',
      color_theme: initialData?.color_theme || 'primary-blue',
      status: initialData?.status || false,
      sort_order: initialData?.sort_order || 0,
    });
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialData]);

  // Real-time field validation
  const validateField = (field: keyof ContactCardFormData, value: any): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length > 100) return 'Title must be 100 characters or less';
        break;
      
      case 'short_description':
        if (value.length > 200) return 'Description must be 200 characters or less';
        break;
      
      case 'detailed_content':
        if (value.length > 5000) return 'Content must be 5000 characters or less';
        break;
      
      case 'cta_link':
        if (value && !value.match(/^(tel:|mailto:|https:).+/)) {
          return 'Link must start with tel:, mailto:, or https:';
        }
        break;
      
      case 'icon':
        if (!value.trim()) return 'Icon is required';
        break;
    }
    return undefined;
  };

  // Validate entire form
  const validate = (): boolean => {
    const newErrors: ContactCardValidationErrors = {};

    // Title validation (required, 1-100 chars)
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    // Short description validation (max 200 chars)
    if (formData.short_description.length > 200) {
      newErrors.short_description = 'Description must be 200 characters or less';
    }

    // Detailed content validation (max 5000 chars)
    if (formData.detailed_content.length > 5000) {
      newErrors.detailed_content = 'Content must be 5000 characters or less';
    }

    // CTA link validation (protocol pattern)
    if (formData.cta_link && !formData.cta_link.match(/^(tel:|mailto:|https:).+/)) {
      newErrors.cta_link = 'Link must start with tel:, mailto:, or https:';
    }

    // Icon validation
    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field changes with real-time validation
  const handleChange = (field: keyof ContactCardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field
    const fieldError = validateField(field, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (fieldError) {
        newErrors[field] = fieldError;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  // Handle field blur
  const handleBlur = (field: keyof ContactCardFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validate()) {
      return;
    }

    try {
      // For updates, exclude sort_order (use reorder buttons instead)
      let submitData: ContactCardFormData | Partial<ContactCardFormData> = formData;
      if (initialData) {
        const { sort_order, ...dataWithoutSortOrder } = formData;
        submitData = dataWithoutSortOrder;
      }
      
      await onSubmit(submitData as ContactCardFormData);
    } catch (err) {
      console.error('Form submission error:', err);
      // Re-throw to let parent handle the error
      throw err;
    }
  };

  // Handle cancel with unsaved changes warning
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      onCancel();
    }
  };

  // Confirm cancel
  const confirmCancel = () => {
    setShowUnsavedDialog(false);
    onCancel();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{initialData ? 'Edit Contact Card' : 'Create Contact Card'}</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={submitting}
                    className="lg:hidden"
                  >
                    {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Icon Picker */}
                <IconPicker
                  value={formData.icon}
                  onChange={(value) => handleChange('icon', value)}
                  disabled={submitting}
                  label="Icon"
                  required
                />
                {touched.icon && errors.icon && (
                  <p className="text-sm text-destructive">{errors.icon}</p>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    placeholder="Enter card title..."
                    disabled={submitting}
                    className={cn(touched.title && errors.title && 'border-destructive')}
                  />
                  <div className="flex justify-between items-start">
                    {touched.title && errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                    <p className={cn('text-xs ml-auto', getCharCountColor(formData.title.length, 100))}>
                      {formData.title.length} / 100
                    </p>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => handleChange('short_description', e.target.value)}
                    onBlur={() => handleBlur('short_description')}
                    placeholder="Brief description for the card..."
                    rows={3}
                    disabled={submitting}
                    className={cn(touched.short_description && errors.short_description && 'border-destructive')}
                  />
                  <div className="flex justify-between items-start">
                    {touched.short_description && errors.short_description && (
                      <p className="text-sm text-destructive">{errors.short_description}</p>
                    )}
                    <p className={cn('text-xs ml-auto', getCharCountColor(formData.short_description.length, 200))}>
                      {formData.short_description.length} / 200
                    </p>
                  </div>
                </div>

                {/* Detailed Content */}
                <div className="space-y-2">
                  <RichTextEditor
                    label="Detailed Content"
                    value={formData.detailed_content}
                    onChange={(value) => handleChange('detailed_content', value)}
                    placeholder="Write detailed content for the modal popup..."
                    minHeight={200}
                  />
                  <div className="flex justify-between items-start">
                    {touched.detailed_content && errors.detailed_content && (
                      <p className="text-sm text-destructive">{errors.detailed_content}</p>
                    )}
                    <p className={cn('text-xs ml-auto', getCharCountColor(formData.detailed_content.length, 5000))}>
                      {formData.detailed_content.length} / 5000
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This content will appear in the modal popup when visitors click the card.
                  </p>
                </div>

                {/* CTA Button Text */}
                <div className="space-y-2">
                  <Label htmlFor="cta_button_text">Call-to-Action Button Text</Label>
                  <Input
                    id="cta_button_text"
                    value={formData.cta_button_text}
                    onChange={(e) => handleChange('cta_button_text', e.target.value)}
                    placeholder="e.g., Call Now, Send Email, Visit Us..."
                    disabled={submitting}
                  />
                </div>

                {/* CTA Link */}
                <div className="space-y-2">
                  <Label htmlFor="cta_link">Call-to-Action Link</Label>
                  <Input
                    id="cta_link"
                    value={formData.cta_link}
                    onChange={(e) => handleChange('cta_link', e.target.value)}
                    onBlur={() => handleBlur('cta_link')}
                    placeholder="tel:+1234567890, mailto:info@example.com, or https://..."
                    disabled={submitting}
                    className={cn(touched.cta_link && errors.cta_link && 'border-destructive')}
                  />
                  {touched.cta_link && errors.cta_link && (
                    <p className="text-sm text-destructive">{errors.cta_link}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use tel: for phone numbers, mailto: for emails, or https: for web links
                  </p>
                </div>

                {/* Color Theme */}
                <ColorThemeSelector
                  value={formData.color_theme}
                  onChange={(value) => handleChange('color_theme', value)}
                  disabled={submitting}
                  label="Color Theme"
                  required
                />

                {/* Sort Order */}
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                    disabled={submitting || !!initialData}
                    readOnly={!!initialData}
                  />
                  <p className="text-xs text-muted-foreground">
                    {initialData 
                      ? 'Use reorder buttons in the list to change the display order'
                      : 'Lower numbers appear first. This will be auto-assigned if left at 0.'}
                  </p>
                </div>

                {/* Published Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="status">Published</Label>
                    <p className="text-xs text-muted-foreground">
                      {formData.status 
                        ? 'This card is visible on the website' 
                        : 'Save as draft (not visible on website)'}
                    </p>
                  </div>
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => handleChange('status', checked)}
                    disabled={submitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save className="h-4 w-4 mr-2" />
                {submitting ? 'Saving...' : formData.status ? 'Publish' : 'Save Draft'}
              </Button>
            </div>
          </div>

          {/* Preview Column - Always visible on desktop, toggleable on mobile */}
          {(showPreview || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <div className="lg:sticky lg:top-6 lg:self-start">
              <LivePreview
                formData={formData}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          )}
        </div>
      </form>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ContactCardForm;
