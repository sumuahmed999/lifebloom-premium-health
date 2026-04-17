/**
 * IconPicker Component
 * 
 * Visual icon selection interface for contact cards.
 * Displays a grid of contact-related icons with selection state and keyboard navigation.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { cn } from '@/lib/utils';
import { Phone, Mail, MapPin, Clock, CreditCard, Heart, Users, Stethoscope } from 'lucide-react';
import { Label } from '@/components/ui/label';

// ============================================================================
// Types
// ============================================================================

export interface IconPickerProps {
  /** Currently selected icon value */
  value: string;
  /** Callback when icon is selected */
  onChange: (icon: string) => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Optional label for the picker */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const ICON_OPTIONS = [
  { value: 'Phone', label: 'Phone', icon: Phone },
  { value: 'Mail', label: 'Email', icon: Mail },
  { value: 'MapPin', label: 'Location', icon: MapPin },
  { value: 'Clock', label: 'Clock', icon: Clock },
  { value: 'CreditCard', label: 'Payment', icon: CreditCard },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Stethoscope', label: 'Medical', icon: Stethoscope },
];

// ============================================================================
// Component
// ============================================================================

export function IconPicker({
  value,
  onChange,
  disabled = false,
  label = 'Icon',
  required = false,
}: IconPickerProps) {
  const handleKeyDown = (e: React.KeyboardEvent, iconValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange(iconValue);
      }
    }
  };

  const selectedIcon = ICON_OPTIONS.find(option => option.value === value);

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Icon Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ICON_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !disabled && onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              disabled={disabled}
              className={cn(
                'flex flex-col items-center justify-center p-4 rounded-lg border-2',
                'transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-background hover:border-primary/50',
                disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:shadow-none'
              )}
              aria-label={`Select ${option.label} icon`}
              aria-pressed={isSelected}
            >
              {/* Icon */}
              <IconComponent
                className={cn(
                  'w-6 h-6 mb-2 transition-colors',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              />

              {/* Icon Name */}
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Icon Display */}
      {selectedIcon && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <span className="font-medium text-foreground">{selectedIcon.label}</span>
        </div>
      )}
    </div>
  );
}

export default IconPicker;
