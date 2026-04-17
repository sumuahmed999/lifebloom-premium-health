/**
 * LivePreview Component
 * 
 * Real-time preview of contact card appearance during creation/editing.
 * Renders card exactly as it will appear on the frontend with desktop/mobile view modes.
 * Updates in real-time as form fields change.
 * 
 * Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7
 */

import { cn } from '@/lib/utils';
import { contactCardThemes } from '@/lib/themes/contactCardThemes';
import type { ContactCardFormData } from '@/types/admin-content';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Monitor, Smartphone } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface LivePreviewProps {
  /** Form data to preview */
  formData: ContactCardFormData;
  /** Current view mode */
  viewMode: 'desktop' | 'mobile';
  /** Callback when view mode changes */
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
}

// ============================================================================
// Component
// ============================================================================

export function LivePreview({
  formData,
  viewMode,
  onViewModeChange,
}: LivePreviewProps) {
  const theme = contactCardThemes[formData.color_theme];
  
  // Get the icon component from Lucide icons
  const IconComponent = (LucideIcons as any)[formData.icon] || LucideIcons.Phone;

  // Determine if CTA button should be shown
  const showCTA = formData.cta_link && formData.cta_button_text;

  return (
    <div className="space-y-4">
      {/* Header with View Mode Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Live Preview</Label>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => onViewModeChange('desktop')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium',
              'transition-colors duration-200',
              viewMode === 'desktop'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Desktop view"
            aria-pressed={viewMode === 'desktop'}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          
          <button
            type="button"
            onClick={() => onViewModeChange('mobile')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium',
              'transition-colors duration-200',
              viewMode === 'mobile'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Mobile view"
            aria-pressed={viewMode === 'mobile'}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div
        className={cn(
          'bg-muted/30 rounded-lg p-6 flex items-center justify-center',
          'border-2 border-dashed border-muted-foreground/20'
        )}
      >
        {/* Preview Card - matches ContactCard component styling */}
        <div
          className={cn(
            'rounded-lg border-2 p-6',
            'transition-all duration-200',
            'hover:shadow-lg hover:-translate-y-1',
            theme.card.background,
            theme.card.border,
            theme.card.shadow,
            // Responsive width based on view mode
            viewMode === 'desktop' ? 'w-full max-w-md' : 'w-full max-w-xs'
          )}
          role="article"
          aria-label="Contact card preview"
        >
          {/* Icon */}
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-4',
            theme.icon.background
          )}>
            <IconComponent className={cn('w-6 h-6', theme.icon.color)} />
          </div>

          {/* Title */}
          <h3 className={cn(
            'text-xl font-semibold mb-2',
            theme.text.title
          )}>
            {formData.title || 'Card Title'}
          </h3>

          {/* Short Description */}
          <p className={cn(
            'text-sm mb-4 line-clamp-3',
            theme.text.description
          )}>
            {formData.short_description || 'Short description will appear here...'}
          </p>

          {/* CTA Button - only show if configured */}
          {showCTA && (
            <Button
              type="button"
              className={cn(
                'w-full',
                theme.button.background,
                theme.button.text
              )}
              disabled
            >
              {formData.cta_button_text}
            </Button>
          )}
        </div>
      </div>

      {/* Preview Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <span className="font-medium">Theme:</span>{' '}
          {formData.color_theme.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </p>
        <p>
          <span className="font-medium">Icon:</span>{' '}
          {formData.icon || 'None selected'}
        </p>
        {showCTA && (
          <p>
            <span className="font-medium">CTA Link:</span>{' '}
            {formData.cta_link}
          </p>
        )}
      </div>
    </div>
  );
}

export default LivePreview;
