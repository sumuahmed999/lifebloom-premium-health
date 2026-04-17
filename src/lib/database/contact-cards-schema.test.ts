/**
 * Contact Cards Database Schema Property-Based Tests
 * 
 * Feature: dynamic-get-in-touch-admin
 * 
 * Property-based tests for database constraints validation:
 * - Property 2: Title Length Validation
 * - Property 3: Short Description Length Validation
 * - Property 4: Detailed Content Length Validation
 * - Property 5: CTA Link Protocol Validation
 * - Property 6: Sort Order Uniqueness
 * - Property 8: Color Theme Validation
 * 
 * Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, 1.8
 * 
 * Note: These tests verify that database constraints are properly enforced.
 * They require an authenticated Supabase connection to test actual database behavior.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ContactCard } from '@/types/admin-content';

// Test configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

describe('Contact Cards Database Schema - Property-Based Tests', () => {
  let supabase: SupabaseClient;
  let isAuthenticated = false;

  beforeAll(async () => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('Supabase credentials not found. Skipping database tests.');
      return;
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check if we can access the table (indicates authentication or public access)
    const { error } = await supabase.from('contact_cards').select('id').limit(1);
    isAuthenticated = !error || !error.message.includes('row-level security');
  });

  describe('Property 2: Title Length Validation', () => {
    it('should reject titles with length < 1 character', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const invalidCard = {
        icon: 'Phone',
        title: '', // Empty title
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999990,
      };

      const { error } = await supabase
        .from('contact_cards')
        .insert(invalidCard)
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/check constraint|violates/i);
    });

    it('should reject titles with length > 100 characters', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const invalidCard = {
        icon: 'Phone',
        title: 'a'.repeat(101), // 101 characters
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999991,
      };

      const { error } = await supabase
        .from('contact_cards')
        .insert(invalidCard)
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/check constraint|violates/i);
    });

    it('should accept titles with length between 1 and 100 characters', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validCard = {
        icon: 'Phone',
        title: 'Valid Title', // 11 characters
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999992,
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(validCard)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });
  });

  describe('Property 3: Short Description Length Validation', () => {
    it('should reject short_description with length > 200 characters', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const invalidCard = {
        icon: 'Phone',
        title: 'Test Card',
        short_description: 'a'.repeat(201), // 201 characters
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999993,
      };

      const { error } = await supabase
        .from('contact_cards')
        .insert(invalidCard)
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/check constraint|violates/i);
    });

    it('should accept short_description with length <= 200 characters', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validCard = {
        icon: 'Phone',
        title: 'Test Card',
        short_description: 'a'.repeat(200), // Exactly 200 characters
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999994,
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(validCard)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });
  });

  describe('Property 4: Detailed Content Length Validation', () => {
    it('should reject detailed_content with length > 5000 characters', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const invalidCard = {
        icon: 'Phone',
        title: 'Test Card',
        short_description: 'Test',
        detailed_content: 'a'.repeat(5001), // 5001 characters
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999995,
      };

      const { error } = await supabase
        .from('contact_cards')
        .insert(invalidCard)
        .select();

      expect(error).toBeTruthy();
      expect(error?.message).toMatch(/check constraint|violates/i);
    });

    it('should accept detailed_content with length <= 5000 characters', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validCard = {
        icon: 'Phone',
        title: 'Test Card',
        short_description: 'Test',
        detailed_content: 'a'.repeat(5000), // Exactly 5000 characters
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999996,
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(validCard)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });
  });

  describe('Property 5: CTA Link Protocol Validation', () => {
    it('should reject cta_link not starting with tel:, mailto:, or https:', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const invalidProtocols = ['http://example.com', 'ftp://example.com', 'javascript:alert(1)'];

      for (const invalidLink of invalidProtocols) {
        const invalidCard = {
          icon: 'Phone',
          title: 'Test Card',
          short_description: 'Test',
          detailed_content: 'Test content',
          cta_button_text: 'Click',
          cta_link: invalidLink,
          color_theme: 'primary-blue',
          status: false,
          sort_order: 999997,
        };

        const { error } = await supabase
          .from('contact_cards')
          .insert(invalidCard)
          .select();

        expect(error).toBeTruthy();
        expect(error?.message).toMatch(/check constraint|violates/i);
      }
    });

    it('should accept cta_link starting with tel:', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validCard = {
        icon: 'Phone',
        title: 'Test Card',
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999998,
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(validCard)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });

    it('should accept cta_link starting with mailto:', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validCard = {
        icon: 'Mail',
        title: 'Test Card',
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Email',
        cta_link: 'mailto:test@example.com',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 999999,
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(validCard)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });

    it('should accept cta_link starting with https:', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validCard = {
        icon: 'MapPin',
        title: 'Test Card',
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Visit',
        cta_link: 'https://example.com',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 1000000,
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(validCard)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });
  });

  describe('Property 6: Sort Order Uniqueness', () => {
    it('should reject duplicate sort_order values', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const card1 = {
        icon: 'Phone',
        title: 'Card 1',
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 1000001,
      };

      // Insert first card
      const { data: data1, error: error1 } = await supabase
        .from('contact_cards')
        .insert(card1)
        .select();

      expect(error1).toBeNull();
      expect(data1).toBeTruthy();

      // Try to insert second card with same sort_order
      const card2 = {
        ...card1,
        title: 'Card 2',
        // Same sort_order
      };

      const { error: error2 } = await supabase
        .from('contact_cards')
        .insert(card2)
        .select();

      expect(error2).toBeTruthy();
      expect(error2?.message).toMatch(/unique|duplicate/i);

      // Cleanup
      if (data1 && data1[0]) {
        await supabase.from('contact_cards').delete().eq('id', data1[0].id);
      }
    });
  });

  describe('Property 8: Color Theme Validation', () => {
    it('should accept valid color themes', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validThemes = ['primary-blue', 'secondary-green', 'accent-teal', 'neutral-gray'];

      for (let i = 0; i < validThemes.length; i++) {
        const validCard = {
          icon: 'Phone',
          title: `Test Card ${i}`,
          short_description: 'Test',
          detailed_content: 'Test content',
          cta_button_text: 'Call',
          cta_link: 'tel:+1234567890',
          color_theme: validThemes[i],
          status: false,
          sort_order: 1000002 + i,
        };

        const { data, error } = await supabase
          .from('contact_cards')
          .insert(validCard)
          .select();

        expect(error).toBeNull();
        expect(data).toBeTruthy();
        expect(data![0].color_theme).toBe(validThemes[i]);

        // Cleanup
        if (data && data[0]) {
          await supabase.from('contact_cards').delete().eq('id', data[0].id);
        }
      }
    });

    it('should use default color theme when not specified', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const cardWithoutTheme = {
        icon: 'Phone',
        title: 'Test Card',
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        status: false,
        sort_order: 1000006,
        // color_theme not specified
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(cardWithoutTheme)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data![0].color_theme).toBe('primary-blue'); // Default value

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });
  });

  describe('Additional Schema Validations', () => {
    it('should automatically set created_at and updated_at timestamps', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const validCard = {
        icon: 'Phone',
        title: 'Timestamp Test',
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        status: false,
        sort_order: 1000007,
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(validCard)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data![0].created_at).toBeTruthy();
      expect(data![0].updated_at).toBeTruthy();

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });

    it('should use false as default status when not specified', async () => {
      if (!isAuthenticated) {
        console.warn('Skipping test: Not authenticated');
        return;
      }

      const cardWithoutStatus = {
        icon: 'Phone',
        title: 'Status Test',
        short_description: 'Test',
        detailed_content: 'Test content',
        cta_button_text: 'Call',
        cta_link: 'tel:+1234567890',
        color_theme: 'primary-blue',
        sort_order: 1000008,
        // status not specified
      };

      const { data, error } = await supabase
        .from('contact_cards')
        .insert(cardWithoutStatus)
        .select();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data![0].status).toBe(false); // Default value

      // Cleanup
      if (data && data[0]) {
        await supabase.from('contact_cards').delete().eq('id', data[0].id);
      }
    });
  });
});
