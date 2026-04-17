/**
 * ColorThemeSelector Component
 * 
 * Visual color theme selection interface for contact cards.
 * Displays four theme options with color swatches and real-time preview.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { getContactCardThemeOptions } from '@/lib/themes/contactCardThemes';
import type { ContactCardTheme } from '@/lib/themes/contactCardThemes';

// ============================================================================
// Types
// ============================================================================

export interface ColorThemeSelectorProps {
  /** Currently selected theme value */
  value: ContactCardTheme;
  /** Callback when theme is selected */
  onChange: (theme: ContactCardTheme) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional label for the selector */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ColorThemeSelector({
  value,
  onChange,
  disabled = false,
  label = 'Color Theme',
  required = false,
}: ColorThemeSelectorProps) {
  const themeOptions = getContactCardThemeOptions();

  const handleKeyDown = (e: React.KeyboardEvent, themeValue: ContactCardTheme) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange(themeValue);
      }
    }
  };

  const selectedTheme = themeOptions.find(option => option.value === value);

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {themeOptions.map((option) => {
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
              aria-label={`Select ${option.label} theme`}
              aria-pressed={isSelected}
            >
              {/* Color Swatch */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full mb-2 transition-transform',
                  option.colorClass,
                  isSelected && 'scale-110 ring-2 ring-offset-2 ring-primary'
                )}
              />

              {/* Theme Name */}
              <span
                className={cn(
                  'text-xs font-medium text-center transition-colors',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Theme Display */}
      {selectedTheme && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <span className="font-medium text-foreground">{selectedTheme.label}</span>
        </div>
      )}
    </div>
  );
}

export default ColorThemeSelector;
