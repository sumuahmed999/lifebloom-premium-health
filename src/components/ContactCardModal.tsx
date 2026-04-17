/**
 * ContactCardModal Component
 * 
 * Modal dialog displaying detailed contact card content.
 * Uses shadcn/ui Dialog component with body scroll lock.
 * Includes close on outside click and Escape key support.
 */

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { contactCardThemes } from '@/lib/themes/contactCardThemes';
import type { ContactCard } from '@/types/admin-content';
import * as LucideIcons from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ContactCardModalProps {
  card: ContactCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactCardModal({ card, isOpen, onClose }: ContactCardModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!card) return null;

  const theme = contactCardThemes[card.color_theme];
  const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.Phone;

  // Handle CTA button click
  const handleCtaClick = () => {
    if (!card.cta_link) return;

    if (card.cta_link.startsWith('tel:')) {
      // Phone call
      window.location.href = card.cta_link;
    } else if (card.cta_link.startsWith('mailto:')) {
      // Email
      window.location.href = card.cta_link;
    } else if (card.cta_link.startsWith('https:')) {
      // External link
      window.open(card.cta_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="sr-only">{card.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Icon and Title */}
          <div className="flex flex-col items-center text-center">
            <div className={cn(
              'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4',
              'transition-transform duration-300',
              theme.icon.background
            )}>
              <IconComponent className={cn('w-7 h-7 sm:w-8 sm:h-8', theme.icon.color)} />
            </div>
            <h2 className={cn('text-xl sm:text-2xl font-bold px-2', theme.text.title)}>
              {card.title}
            </h2>
          </div>

          {/* Detailed Content (HTML) */}
          <div
            className="prose prose-sm sm:prose-base max-w-none px-2 sm:px-0"
            dangerouslySetInnerHTML={{ __html: card.detailed_content }}
          />

          {/* CTA Button - only show if link is valid */}
          {card.cta_link && card.cta_button_text && (
            <div className="flex justify-center pt-2 sm:pt-4 px-2 sm:px-0">
              <Button
                onClick={handleCtaClick}
                className={cn(
                  'w-full sm:w-auto px-6 sm:px-8 min-h-[44px]',
                  'transition-all duration-200',
                  theme.button.background,
                  theme.button.text
                )}
              >
                {card.cta_button_text}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
