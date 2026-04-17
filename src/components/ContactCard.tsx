/**
 * ContactCard Component
 * 
 * Displays a contact card with icon, title, description, and CTA button.
 * Applies color theme styling and includes hover animations.
 * Supports keyboard navigation and accessibility features.
 */

import { cn } from '@/lib/utils';
import { contactCardThemes } from '@/lib/themes/contactCardThemes';
import type { ContactCard as ContactCardType } from '@/types/admin-content';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactCardProps {
  card: ContactCardType;
  onClick: () => void;
}

export function ContactCard({ card, onClick }: ContactCardProps) {
  const theme = contactCardThemes[card.color_theme];
  
  // Get the icon component from Lucide icons
  const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.Phone;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 md:p-6 cursor-pointer',
        'transition-all duration-300 ease-out',
        'hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'active:scale-[0.98]',
        'min-h-[240px] sm:min-h-[260px] md:min-h-[280px] flex flex-col',
        theme.card.background,
        theme.card.border,
        theme.card.shadow,
        theme.button.ring
      )}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${card.title}`}
    >
      {/* Icon with pulse animation on hover */}
      <div className={cn(
        'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4',
        'transition-transform duration-300 group-hover:scale-110',
        theme.icon.background
      )}>
        <IconComponent className={cn('w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7', theme.icon.color)} />
      </div>

      {/* Title */}
      <h3 className={cn(
        'text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1.5 sm:mb-2 md:mb-3 leading-tight',
        theme.text.title
      )}>
        {card.title}
      </h3>

      {/* Short Description */}
      <p className={cn(
        'text-[11px] sm:text-xs md:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3 flex-grow leading-relaxed',
        theme.text.description
      )}>
        {card.short_description}
      </p>

      {/* CTA Button - only show if link is valid */}
      {card.cta_link && card.cta_button_text && (
        <Button
          className={cn(
            'w-full mt-auto min-h-[40px] sm:min-h-[44px]',
            'transition-all duration-200',
            'group-hover:shadow-md',
            'text-xs sm:text-sm md:text-base',
            'px-2 sm:px-3 md:px-4',
            theme.button.background,
            theme.button.text
          )}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking button
          }}
        >
          {card.cta_button_text}
        </Button>
      )}
    </div>
  );
}
