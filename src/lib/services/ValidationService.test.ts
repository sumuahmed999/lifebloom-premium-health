/**
 * Unit tests for ValidationService
 * 
 * Tests basic validation functionality for all methods
 */

import { describe, it, expect } from 'vitest';
import { ValidationService } from './ValidationService';
import type { Service, Testimonial, BlogPost, VideoPost, ContactInfo } from '../../types/admin-content';

describe('ValidationService', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(ValidationService.validateEmail('test@example.com')).toBe(true);
      expect(ValidationService.validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(ValidationService.validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(ValidationService.validateEmail('')).toBe(false);
      expect(ValidationService.validateEmail('invalid')).toBe(false);
      expect(ValidationService.validateEmail('missing@domain')).toBe(false);
      expect(ValidationService.validateEmail('@example.com')).toBe(false);
      expect(ValidationService.validateEmail('user@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone formats', () => {
      expect(ValidationService.validatePhone('1234567890')).toBe(true);
      expect(ValidationService.validatePhone('123-456-7890')).toBe(true);
      expect(ValidationService.validatePhone('(123) 456-7890')).toBe(true);
      expect(ValidationService.validatePhone('+1 123 456 7890')).toBe(true);
      expect(ValidationService.validatePhone('123.456.7890')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(ValidationService.validatePhone('')).toBe(false);
      expect(ValidationService.validatePhone('123')).toBe(false);
      expect(ValidationService.validatePhone('abc-def-ghij')).toBe(false);
      expect(ValidationService.validatePhone('12345678901234567890')).toBe(false); // too long
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URL formats', () => {
      expect(ValidationService.validateUrl('http://example.com')).toBe(true);
      expect(ValidationService.validateUrl('https://example.com')).toBe(true);
      expect(ValidationService.validateUrl('https://example.com/path')).toBe(true);
      expect(ValidationService.validateUrl('https://example.com/path?query=value')).toBe(true);
    });

    it('should reject invalid URL formats', () => {
      expect(ValidationService.validateUrl('')).toBe(false);
      expect(ValidationService.validateUrl('not-a-url')).toBe(false);
      expect(ValidationService.validateUrl('ftp://example.com')).toBe(false);
      expect(ValidationService.validateUrl('//example.com')).toBe(false);
    });
  });

  describe('validateNumeric', () => {
    it('should validate numeric values', () => {
      expect(ValidationService.validateNumeric(123)).toBe(true);
      expect(ValidationService.validateNumeric(0)).toBe(true);
      expect(ValidationService.validateNumeric(-123)).toBe(true);
      expect(ValidationService.validateNumeric(123.45)).toBe(true);
      expect(ValidationService.validateNumeric('123')).toBe(true);
    });

    it('should reject non-numeric values', () => {
      expect(ValidationService.validateNumeric('')).toBe(false);
      expect(ValidationService.validateNumeric('abc')).toBe(false);
      expect(ValidationService.validateNumeric(null)).toBe(false);
      expect(ValidationService.validateNumeric(undefined)).toBe(false);
      expect(ValidationService.validateNumeric(NaN)).toBe(false);
      expect(ValidationService.validateNumeric(Infinity)).toBe(false);
    });
  });

  describe('validateImage', () => {
    it('should validate correct image files', () => {
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = ValidationService.validateImage(validFile);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject invalid file types', () => {
      const invalidFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = ValidationService.validateImage(invalidFile);
      expect(result.valid).toBe(false);
      expect(result.errors.fileType).toBeDefined();
    });

    it('should reject files exceeding size limit', () => {
      // Create a 6MB file (exceeds default 5MB limit)
      const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
      const largeFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const result = ValidationService.validateImage(largeFile);
      expect(result.valid).toBe(false);
      expect(result.errors.fileSize).toBeDefined();
    });
  });

  describe('validateService', () => {
    it('should validate complete service data', () => {
      const service: Partial<Service> = {
        title: 'Test Service',
        description: 'Test description',
        icon: 'heart',
        features: ['Feature 1', 'Feature 2'],
        color_scheme: 'blue',
      };
      const result = ValidationService.validateService(service);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject service with missing required fields', () => {
      const service: Partial<Service> = {
        title: '',
        description: '',
      };
      const result = ValidationService.validateService(service);
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.description).toBeDefined();
      expect(result.errors.icon).toBeDefined();
      expect(result.errors.features).toBeDefined();
    });
  });

  describe('validateTestimonial', () => {
    it('should validate complete testimonial data', () => {
      const testimonial: Partial<Testimonial> = {
        customer_name: 'John Doe',
        testimonial_text: 'Great service!',
        rating: 5,
      };
      const result = ValidationService.validateTestimonial(testimonial);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject testimonial with invalid rating', () => {
      const testimonial: Partial<Testimonial> = {
        customer_name: 'John Doe',
        testimonial_text: 'Great service!',
        rating: 6, // Invalid: must be 1-5
      };
      const result = ValidationService.validateTestimonial(testimonial);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBeDefined();
    });

    it('should reject testimonial with rating below 1', () => {
      const testimonial: Partial<Testimonial> = {
        customer_name: 'John Doe',
        testimonial_text: 'Great service!',
        rating: 0,
      };
      const result = ValidationService.validateTestimonial(testimonial);
      expect(result.valid).toBe(false);
      expect(result.errors.rating).toBeDefined();
    });
  });

  describe('validateBlogPost', () => {
    it('should validate complete blog post data', () => {
      const blogPost: Partial<BlogPost> = {
        title: 'Test Blog',
        content: 'Blog content here',
        author: 'Jane Doe',
        category: 'Health',
        read_time: 5,
      };
      const result = ValidationService.validateBlogPost(blogPost);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject blog post with missing required fields', () => {
      const blogPost: Partial<BlogPost> = {
        title: '',
      };
      const result = ValidationService.validateBlogPost(blogPost);
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.content).toBeDefined();
      expect(result.errors.author).toBeDefined();
      expect(result.errors.category).toBeDefined();
    });
  });

  describe('validateVideoPost', () => {
    it('should validate complete video post data', () => {
      const videoPost: Partial<VideoPost> = {
        title: 'Test Video',
        video_url: 'https://example.com/video.mp4',
        category: 'Education',
        duration: 300,
      };
      const result = ValidationService.validateVideoPost(videoPost);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject video post with non-positive duration', () => {
      const videoPost: Partial<VideoPost> = {
        title: 'Test Video',
        video_url: 'https://example.com/video.mp4',
        category: 'Education',
        duration: 0, // Invalid: must be positive
      };
      const result = ValidationService.validateVideoPost(videoPost);
      expect(result.valid).toBe(false);
      expect(result.errors.duration).toBeDefined();
    });

    it('should reject video post with negative duration', () => {
      const videoPost: Partial<VideoPost> = {
        title: 'Test Video',
        video_url: 'https://example.com/video.mp4',
        category: 'Education',
        duration: -10,
      };
      const result = ValidationService.validateVideoPost(videoPost);
      expect(result.valid).toBe(false);
      expect(result.errors.duration).toBeDefined();
    });
  });

  describe('validateContactInfo', () => {
    it('should validate complete contact info data', () => {
      const contactInfo: Partial<ContactInfo> = {
        address: '123 Main St',
        primary_phone: '123-456-7890',
        email: 'contact@example.com',
        operating_hours: {
          monday: { open: '9:00', close: '17:00' },
          tuesday: { open: '9:00', close: '17:00' },
          wednesday: { open: '9:00', close: '17:00' },
          thursday: { open: '9:00', close: '17:00' },
          friday: { open: '9:00', close: '17:00' },
          saturday: { open: '10:00', close: '14:00' },
          sunday: { closed: true, open: '', close: '' },
        },
      };
      const result = ValidationService.validateContactInfo(contactInfo);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should reject contact info with invalid email', () => {
      const contactInfo: Partial<ContactInfo> = {
        address: '123 Main St',
        primary_phone: '123-456-7890',
        email: 'invalid-email',
        operating_hours: {
          monday: { open: '9:00', close: '17:00' },
          tuesday: { open: '9:00', close: '17:00' },
          wednesday: { open: '9:00', close: '17:00' },
          thursday: { open: '9:00', close: '17:00' },
          friday: { open: '9:00', close: '17:00' },
          saturday: { open: '10:00', close: '14:00' },
          sunday: { closed: true, open: '', close: '' },
        },
      };
      const result = ValidationService.validateContactInfo(contactInfo);
      expect(result.valid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it('should reject contact info with invalid phone', () => {
      const contactInfo: Partial<ContactInfo> = {
        address: '123 Main St',
        primary_phone: '123', // Too short
        email: 'contact@example.com',
        operating_hours: {
          monday: { open: '9:00', close: '17:00' },
          tuesday: { open: '9:00', close: '17:00' },
          wednesday: { open: '9:00', close: '17:00' },
          thursday: { open: '9:00', close: '17:00' },
          friday: { open: '9:00', close: '17:00' },
          saturday: { open: '10:00', close: '14:00' },
          sunday: { closed: true, open: '', close: '' },
        },
      };
      const result = ValidationService.validateContactInfo(contactInfo);
      expect(result.valid).toBe(false);
      expect(result.errors.primary_phone).toBeDefined();
    });
  });
});
