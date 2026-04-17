/**
 * ValidationService - Provides validation methods for all content types
 * 
 * This service implements validation for:
 * - Common field validations (email, phone, URL)
 * - Content-specific validations (Service, Testimonial, BlogPost, VideoPost, ContactInfo)
 * - Image file validations (type and size)
 * 
 * Requirements: 2.8, 3.8, 4.11, 5.10, 5.11, 6.5, 6.6, 11.6, 11.7
 */

import type {
  Service,
  Testimonial,
  BlogPost,
  VideoPost,
  ContactInfo,
  ValidationResult,
} from '../../types/admin-content';

export class ValidationService {
  // ============================================================================
  // Common Field Validations
  // ============================================================================

  /**
   * Validate email format
   * Requirements: 6.5, 11.6
   * 
   * @param email - Email address to validate
   * @returns true if valid email format, false otherwise
   */
  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    // RFC 5322 compliant email regex (simplified but robust)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate phone number format
   * Requirements: 6.6
   * 
   * Accepts various formats:
   * - (123) 456-7890
   * - 123-456-7890
   * - 123.456.7890
   * - 1234567890
   * - +1 123 456 7890
   * 
   * @param phone - Phone number to validate
   * @returns true if valid phone format, false otherwise
   */
  static validatePhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') {
      return false;
    }

    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Must have 10-15 digits (supports international formats)
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return false;
    }

    // Basic phone format regex (flexible for various formats)
    const phoneRegex = /^[\d\s\-\.\(\)\+]+$/;
    return phoneRegex.test(phone.trim());
  }

  /**
   * Validate URL format
   * Requirements: 11.6
   * 
   * @param url - URL to validate
   * @returns true if valid URL format, false otherwise
   */
  static validateUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const urlObj = new URL(url.trim());
      // Must have http or https protocol
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validate that a value is a valid number
   * Requirements: 11.7
   * 
   * @param value - Value to validate as number
   * @returns true if valid number, false otherwise
   */
  static validateNumeric(value: any): boolean {
    if (value === null || value === undefined || value === '') {
      return false;
    }

    const num = Number(value);
    return !isNaN(num) && isFinite(num);
  }

  // ============================================================================
  // Image Validation
  // ============================================================================

  /**
   * Validate image file type and size
   * Requirements: 10.2, 10.6, 10.7
   * 
   * @param file - File object to validate
   * @param maxSizeMB - Maximum file size in megabytes (default: 5)
   * @returns ValidationResult with errors if any
   */
  static validateImage(file: File, maxSizeMB: number = 5): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      errors.fileType = `Invalid file type. Accepted formats: JPEG, PNG, WebP`;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.fileSize = `File size exceeds ${maxSizeMB}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // ============================================================================
  // Content-Specific Validations
  // ============================================================================

  /**
   * Validate Service data
   * Requirements: 2.8
   * 
   * @param data - Partial Service data to validate
   * @returns ValidationResult with field-specific errors
   */
  static validateService(data: Partial<Service>): ValidationResult {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.length > 255) {
      errors.title = 'Title must not exceed 255 characters';
    }

    if (!data.description || data.description.trim() === '') {
      errors.description = 'Description is required';
    }

    if (!data.icon || data.icon.trim() === '') {
      errors.icon = 'Icon is required';
    }

    if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
      errors.features = 'At least one feature is required';
    }

    if (!data.color_scheme || data.color_scheme.trim() === '') {
      errors.color_scheme = 'Color scheme is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate Testimonial data
   * Requirements: 3.8
   * 
   * @param data - Partial Testimonial data to validate
   * @returns ValidationResult with field-specific errors
   */
  static validateTestimonial(data: Partial<Testimonial>): ValidationResult {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.customer_name || data.customer_name.trim() === '') {
      errors.customer_name = 'Customer name is required';
    } else if (data.customer_name.length > 255) {
      errors.customer_name = 'Customer name must not exceed 255 characters';
    }

    if (!data.testimonial_text || data.testimonial_text.trim() === '') {
      errors.testimonial_text = 'Testimonial text is required';
    }

    // Rating validation (1-5)
    if (data.rating === undefined || data.rating === null) {
      errors.rating = 'Rating is required';
    } else if (!this.validateNumeric(data.rating)) {
      errors.rating = 'Rating must be a valid number';
    } else if (data.rating < 1 || data.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    // Optional image URL validation
    if (data.image_url && data.image_url.trim() !== '' && !this.validateUrl(data.image_url)) {
      errors.image_url = 'Invalid image URL format';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate BlogPost data
   * Requirements: 4.11
   * 
   * @param data - Partial BlogPost data to validate
   * @returns ValidationResult with field-specific errors
   */
  static validateBlogPost(data: Partial<BlogPost>): ValidationResult {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.length > 255) {
      errors.title = 'Title must not exceed 255 characters';
    }

    if (!data.content || data.content.trim() === '') {
      errors.content = 'Content is required';
    }

    if (!data.author || data.author.trim() === '') {
      errors.author = 'Author is required';
    } else if (data.author.length > 255) {
      errors.author = 'Author must not exceed 255 characters';
    }

    if (!data.category || data.category.trim() === '') {
      errors.category = 'Category is required';
    } else if (data.category.length > 100) {
      errors.category = 'Category must not exceed 100 characters';
    }

    // Read time validation
    if (data.read_time !== undefined && data.read_time !== null) {
      if (!this.validateNumeric(data.read_time)) {
        errors.read_time = 'Read time must be a valid number';
      } else if (data.read_time < 0) {
        errors.read_time = 'Read time must be a positive number';
      }
    }

    // Optional image URL validation
    if (data.image_url && data.image_url.trim() !== '' && !this.validateUrl(data.image_url)) {
      errors.image_url = 'Invalid image URL format';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate VideoPost data
   * Requirements: 5.10, 5.11
   * 
   * @param data - Partial VideoPost data to validate
   * @returns ValidationResult with field-specific errors
   */
  static validateVideoPost(data: Partial<VideoPost>): ValidationResult {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.length > 255) {
      errors.title = 'Title must not exceed 255 characters';
    }

    if (!data.video_url || data.video_url.trim() === '') {
      errors.video_url = 'Video URL is required';
    } else if (!this.validateUrl(data.video_url)) {
      errors.video_url = 'Invalid video URL format';
    }

    if (!data.category || data.category.trim() === '') {
      errors.category = 'Category is required';
    } else if (data.category.length > 100) {
      errors.category = 'Category must not exceed 100 characters';
    }

    // Duration validation (must be positive)
    if (data.duration === undefined || data.duration === null) {
      errors.duration = 'Duration is required';
    } else if (!this.validateNumeric(data.duration)) {
      errors.duration = 'Duration must be a valid number';
    } else if (data.duration <= 0) {
      errors.duration = 'Duration must be a positive number';
    }

    // Optional thumbnail URL validation
    if (data.thumbnail_url && data.thumbnail_url.trim() !== '' && !this.validateUrl(data.thumbnail_url)) {
      errors.thumbnail_url = 'Invalid thumbnail URL format';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate ContactInfo data
   * Requirements: 6.5, 6.6
   * 
   * @param data - Partial ContactInfo data to validate
   * @returns ValidationResult with field-specific errors
   */
  static validateContactInfo(data: Partial<ContactInfo>): ValidationResult {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.address || data.address.trim() === '') {
      errors.address = 'Address is required';
    }

    if (!data.primary_phone || data.primary_phone.trim() === '') {
      errors.primary_phone = 'Primary phone is required';
    } else if (!this.validatePhone(data.primary_phone)) {
      errors.primary_phone = 'Invalid phone number format';
    }

    // Optional secondary phone validation
    if (data.secondary_phone && data.secondary_phone.trim() !== '' && !this.validatePhone(data.secondary_phone)) {
      errors.secondary_phone = 'Invalid phone number format';
    }

    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    // Operating hours validation
    if (!data.operating_hours || typeof data.operating_hours !== 'object') {
      errors.operating_hours = 'Operating hours are required';
    } else {
      // Validate each day's hours
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of days) {
        const hours = data.operating_hours[day];
        if (!hours) {
          errors[`operating_hours_${day}`] = `${day.charAt(0).toUpperCase() + day.slice(1)} hours are required`;
        } else if (!hours.closed && (!hours.open || !hours.close)) {
          errors[`operating_hours_${day}`] = `${day.charAt(0).toUpperCase() + day.slice(1)} must have open and close times`;
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate ContactCard data
   * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7
   * 
   * @param data - Partial ContactCard data to validate
   * @returns ValidationResult with field-specific errors
   */
  static validateContactCard(data: Partial<any>): ValidationResult {
    const errors: Record<string, string> = {};

    // Title validation (required, 1-100 characters)
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Title is required';
    } else if (data.title.length < 1) {
      errors.title = 'Title must be at least 1 character';
    } else if (data.title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }

    // Short description validation (max 200 characters)
    if (data.short_description && data.short_description.length > 200) {
      errors.short_description = 'Description must be 200 characters or less';
    }

    // Detailed content validation (max 5000 characters)
    if (data.detailed_content && data.detailed_content.length > 5000) {
      errors.detailed_content = 'Content must be 5000 characters or less';
    }

    // CTA link validation (must match protocol pattern)
    if (data.cta_link && data.cta_link.trim() !== '') {
      const ctaLinkPattern = /^(tel:|mailto:|https:).+/;
      if (!ctaLinkPattern.test(data.cta_link)) {
        errors.cta_link = 'Link must start with tel:, mailto:, or https:';
      }
    }

    // Icon validation (required)
    if (!data.icon || data.icon.trim() === '') {
      errors.icon = 'Icon is required';
    }

    // Color theme validation (required, must be valid theme)
    const validThemes = ['primary-blue', 'secondary-green', 'accent-teal', 'neutral-gray'];
    if (!data.color_theme || data.color_theme.trim() === '') {
      errors.color_theme = 'Color theme is required';
    } else if (!validThemes.includes(data.color_theme)) {
      errors.color_theme = 'Invalid color theme';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
