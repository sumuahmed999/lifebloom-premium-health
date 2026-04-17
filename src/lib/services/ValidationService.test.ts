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

  describe('validateContactCard', () => {
    it('should validate complete contact card data', () => {
      const contactCard = {
        icon: 'Phone',
        title: 'Call Us',
        short_description: 'Get in touch with our team',
        detailed_content: 'Call us anytime during business hours',
        cta_button_text: 'Call Now',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
      };
      const result = ValidationService.validateContactCard(contactCard);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    describe('title validation', () => {
      it('should reject empty title', () => {
        const contactCard = {
          icon: 'Phone',
          title: '',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.title).toBe('Title is required');
      });

      it('should reject title with only whitespace', () => {
        const contactCard = {
          icon: 'Phone',
          title: '   ',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.title).toBe('Title is required');
      });

      it('should accept title with exactly 1 character', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'A',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.title).toBeUndefined();
      });

      it('should accept title with exactly 100 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'A'.repeat(100),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.title).toBeUndefined();
      });

      it('should reject title with 101 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'A'.repeat(101),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.title).toBe('Title must be 100 characters or less');
      });

      it('should reject title exceeding 100 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'A'.repeat(150),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.title).toBe('Title must be 100 characters or less');
      });
    });

    describe('short_description validation', () => {
      it('should accept empty short_description', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          short_description: '',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.short_description).toBeUndefined();
      });

      it('should accept short_description with exactly 200 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          short_description: 'A'.repeat(200),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.short_description).toBeUndefined();
      });

      it('should reject short_description with 201 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          short_description: 'A'.repeat(201),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.short_description).toBe('Description must be 200 characters or less');
      });

      it('should reject short_description exceeding 200 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          short_description: 'A'.repeat(300),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.short_description).toBe('Description must be 200 characters or less');
      });
    });

    describe('detailed_content validation', () => {
      it('should accept empty detailed_content', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          detailed_content: '',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.detailed_content).toBeUndefined();
      });

      it('should accept detailed_content with exactly 5000 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          detailed_content: 'A'.repeat(5000),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.detailed_content).toBeUndefined();
      });

      it('should reject detailed_content with 5001 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          detailed_content: 'A'.repeat(5001),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.detailed_content).toBe('Content must be 5000 characters or less');
      });

      it('should reject detailed_content exceeding 5000 characters', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          detailed_content: 'A'.repeat(6000),
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.detailed_content).toBe('Content must be 5000 characters or less');
      });
    });

    describe('cta_link validation', () => {
      it('should accept empty cta_link', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          cta_link: '',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.cta_link).toBeUndefined();
      });

      it('should accept valid tel: link', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          cta_link: 'tel:+1234567890',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.cta_link).toBeUndefined();
      });

      it('should accept valid mailto: link', () => {
        const contactCard = {
          icon: 'Mail',
          title: 'Email Us',
          cta_link: 'mailto:contact@example.com',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.cta_link).toBeUndefined();
      });

      it('should accept valid https: link', () => {
        const contactCard = {
          icon: 'MapPin',
          title: 'Visit Us',
          cta_link: 'https://maps.google.com/location',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.cta_link).toBeUndefined();
      });

      it('should reject http: link (not https:)', () => {
        const contactCard = {
          icon: 'MapPin',
          title: 'Visit Us',
          cta_link: 'http://example.com',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.cta_link).toBe('Link must start with tel:, mailto:, or https:');
      });

      it('should reject ftp: link', () => {
        const contactCard = {
          icon: 'MapPin',
          title: 'Visit Us',
          cta_link: 'ftp://example.com',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.cta_link).toBe('Link must start with tel:, mailto:, or https:');
      });

      it('should reject link without protocol', () => {
        const contactCard = {
          icon: 'MapPin',
          title: 'Visit Us',
          cta_link: 'example.com',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.cta_link).toBe('Link must start with tel:, mailto:, or https:');
      });

      it('should reject link with only protocol (no content after)', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          cta_link: 'tel:',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.cta_link).toBe('Link must start with tel:, mailto:, or https:');
      });
    });

    describe('icon validation', () => {
      it('should reject empty icon', () => {
        const contactCard = {
          icon: '',
          title: 'Call Us',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.icon).toBe('Icon is required');
      });

      it('should reject icon with only whitespace', () => {
        const contactCard = {
          icon: '   ',
          title: 'Call Us',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.icon).toBe('Icon is required');
      });

      it('should accept valid icon name', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.icon).toBeUndefined();
      });
    });

    describe('color_theme validation', () => {
      it('should reject empty color_theme', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: '',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.color_theme).toBe('Color theme is required');
      });

      it('should reject color_theme with only whitespace', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: '   ',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.color_theme).toBe('Color theme is required');
      });

      it('should accept primary-blue theme', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: 'primary-blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.color_theme).toBeUndefined();
      });

      it('should accept secondary-green theme', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: 'secondary-green',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.color_theme).toBeUndefined();
      });

      it('should accept accent-teal theme', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: 'accent-teal',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.color_theme).toBeUndefined();
      });

      it('should accept neutral-gray theme', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: 'neutral-gray',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.errors.color_theme).toBeUndefined();
      });

      it('should reject invalid color_theme', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: 'invalid-theme',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.color_theme).toBe('Invalid color theme');
      });

      it('should reject color_theme with wrong case', () => {
        const contactCard = {
          icon: 'Phone',
          title: 'Call Us',
          color_theme: 'Primary-Blue',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.color_theme).toBe('Invalid color theme');
      });
    });

    describe('multiple validation errors', () => {
      it('should return all validation errors when multiple fields are invalid', () => {
        const contactCard = {
          icon: '',
          title: '',
          short_description: 'A'.repeat(201),
          detailed_content: 'A'.repeat(5001),
          cta_link: 'invalid-link',
          color_theme: 'invalid-theme',
        };
        const result = ValidationService.validateContactCard(contactCard);
        expect(result.valid).toBe(false);
        expect(result.errors.icon).toBeDefined();
        expect(result.errors.title).toBeDefined();
        expect(result.errors.short_description).toBeDefined();
        expect(result.errors.detailed_content).toBeDefined();
        expect(result.errors.cta_link).toBeDefined();
        expect(result.errors.color_theme).toBeDefined();
      });
    });
  });
});
