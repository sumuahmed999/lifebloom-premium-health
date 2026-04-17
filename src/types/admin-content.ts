/**
 * TypeScript interfaces for Admin Content Management
 * 
 * These interfaces define the structure of content types managed through
 * the admin panel. All IDs are UUID strings to match the Supabase implementation.
 */

// ============================================================================
// Core Content Types
// ============================================================================

/**
 * Service - Healthcare service offering
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  content?: string | null;
  icon: string;
  features: string[];
  color_scheme: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * Testimonial - Customer review and feedback
 */
export interface Testimonial {
  id: string;
  customer_name: string;
  customer_role?: string;
  image_url?: string;
  rating: number; // 1-5
  testimonial_text: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * BlogPost - Article with rich text content
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image_url?: string;
  category: string;
  read_time: number;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * VideoPost - Video content with metadata
 */
export interface VideoPost {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  category: string;
  duration: number; // in seconds
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * ContactInfo - Business contact details
 */
export interface ContactInfo {
  id: string;
  address: string;
  primary_phone: string;
  secondary_phone?: string;
  email: string;
  operating_hours: OperatingHours;
  section_heading?: string;
  section_subtitle?: string;
  content_title?: string;
  content_description?: string;
  updated_at: string;
  updated_by: string | null;
}

/**
 * AdminUser - Administrator user information
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_login?: string;
}

// ============================================================================
// Supporting Types
// ============================================================================

/**
 * OperatingHours - Business hours for each day of the week
 */
export interface OperatingHours {
  [day: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

/**
 * ValidationResult - Result of form validation
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * QueryFilters - Filters for content queries
 */
export interface QueryFilters {
  published?: boolean;
  status?: boolean;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * BulkAction - Available bulk operations
 */
export type BulkAction = 'publish' | 'unpublish' | 'delete';

/**
 * ContentType - Available content types
 */
export type ContentType = 'services' | 'testimonials' | 'blogs' | 'videos' | 'contact' | 'get_in_touch' | 'contact_cards';

/**
 * Enquiry - Contact form submission
 */
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  resolved_by?: string | null;
  resolved_at?: string | null;
  notes?: string | null;
}

/**
 * GetInTouchContent - Editable content for Get in Touch section
 */
export interface GetInTouchContent {
  id: string;
  badge_text: string;
  heading: string;
  description: string;
  intro_heading: string;
  intro_description: string;
  call_card_title: string;
  call_card_description: string;
  call_card_button_text: string;
  email_card_title: string;
  email_card_description: string;
  email_card_button_text: string;
  visit_card_title: string;
  visit_card_description: string;
  visit_card_button_text: string;
  hours_card_title: string;
  hours_card_description: string;
  updated_at: string;
  updated_by: string | null;
}

/**
 * ContactCard - Contact information card with rich content
 */
export interface ContactCard {
  id: string;
  icon: string;
  title: string;
  short_description: string;
  detailed_content: string;
  cta_button_text: string;
  cta_link: string;
  color_theme: 'primary-blue' | 'secondary-green' | 'accent-teal' | 'neutral-gray';
  status: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * ContactCardFormData - Form data for creating/editing contact cards
 */
export type ContactCardFormData = Omit<ContactCard, 'id' | 'created_at' | 'updated_at'>;

/**
 * ContactCardUpdate - Partial update data for contact cards
 */
export type ContactCardUpdate = Partial<ContactCardFormData>;

/**
 * ContactCardValidationErrors - Form validation errors for contact cards
 */
export interface ContactCardValidationErrors {
  title?: string;
  short_description?: string;
  detailed_content?: string;
  cta_link?: string;
  icon?: string;
  color_theme?: string;
}

/**
 * ContactCardValidationResult - Validation result for contact cards
 */
export interface ContactCardValidationResult {
  valid: boolean;
  errors: ContactCardValidationErrors;
}

/**
 * ColorTheme - Color theme configuration for contact cards
 */
export interface ColorTheme {
  card: {
    background: string;
    border: string;
    shadow: string;
  };
  icon: {
    background: string;
    color: string;
  };
  text: {
    title: string;
    description: string;
  };
  button: {
    background: string;
    text: string;
    ring: string;
  };
}

/**
 * ColorThemeConfig - Map of theme names to ColorTheme configurations
 */
export type ColorThemeConfig = {
  [K in ContactCard['color_theme']]: ColorTheme;
};
