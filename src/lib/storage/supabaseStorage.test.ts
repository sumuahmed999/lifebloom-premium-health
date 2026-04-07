/**
 * Unit tests for Supabase Storage utilities
 * 
 * Tests validation logic and helper functions without requiring
 * actual Supabase connection (mocked for integration tests)
 */

import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  generateUniqueFilename,
  extractPathFromUrl,
  type StorageBucket
} from './supabaseStorage';

describe('validateImageFile', () => {
  it('should accept valid JPEG files under 5MB', () => {
    const file = new File(['x'.repeat(1024)], 'test.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid PNG files under 5MB', () => {
    const file = new File(['x'.repeat(1024)], 'test.png', { type: 'image/png' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid WebP files under 5MB', () => {
    const file = new File(['x'.repeat(1024)], 'test.webp', { type: 'image/webp' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject files over 5MB', () => {
    // Create a file larger than 5MB
    const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds 5MB limit');
  });

  it('should reject non-image file types', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('should reject unsupported image types', () => {
    const file = new File(['test'], 'test.gif', { type: 'image/gif' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('should include file type in error message', () => {
    const file = new File(['test'], 'test.svg', { type: 'image/svg+xml' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('image/svg+xml');
  });

  it('should include file size in error message for oversized files', () => {
    const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/\d+\.\d+MB/);
  });
});

describe('generateUniqueFilename', () => {
  it('should prefix filename with timestamp', () => {
    const filename = generateUniqueFilename('test.jpg');
    
    expect(filename).toMatch(/^\d+_test\.jpg$/);
  });

  it('should sanitize special characters', () => {
    const filename = generateUniqueFilename('test file (1).jpg');
    
    expect(filename).toMatch(/^\d+_test_file__1_\.jpg$/);
  });

  it('should preserve dots and dashes', () => {
    const filename = generateUniqueFilename('test-file.v2.jpg');
    
    expect(filename).toMatch(/^\d+_test-file\.v2\.jpg$/);
  });

  it('should handle filenames with no extension', () => {
    const filename = generateUniqueFilename('testfile');
    
    expect(filename).toMatch(/^\d+_testfile$/);
  });

  it('should generate different timestamps for sequential calls', async () => {
    const filename1 = generateUniqueFilename('test.jpg');
    
    // Wait 1ms to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 1));
    
    const filename2 = generateUniqueFilename('test.jpg');
    
    expect(filename1).not.toBe(filename2);
  });
});

describe('extractPathFromUrl', () => {
  const bucket: StorageBucket = 'blogs';

  it('should extract path from valid Supabase Storage URL', () => {
    const url = 'https://rejudwrynbxoyzlrqqst.supabase.co/storage/v1/object/public/blogs/1704067200000_image.jpg';
    const path = extractPathFromUrl(url, bucket);
    
    expect(path).toBe('1704067200000_image.jpg');
  });

  it('should extract nested path from URL', () => {
    const url = 'https://rejudwrynbxoyzlrqqst.supabase.co/storage/v1/object/public/blogs/2024/01/image.jpg';
    const path = extractPathFromUrl(url, bucket);
    
    expect(path).toBe('2024/01/image.jpg');
  });

  it('should return null for invalid URL', () => {
    const url = 'not-a-valid-url';
    const path = extractPathFromUrl(url, bucket);
    
    expect(path).toBeNull();
  });

  it('should return null if bucket not found in URL', () => {
    const url = 'https://example.com/storage/v1/object/public/other-bucket/image.jpg';
    const path = extractPathFromUrl(url, bucket);
    
    expect(path).toBeNull();
  });

  it('should return null if no path after bucket', () => {
    const url = 'https://example.com/storage/v1/object/public/blogs';
    const path = extractPathFromUrl(url, bucket);
    
    expect(path).toBeNull();
  });

  it('should handle URLs with query parameters', () => {
    const url = 'https://rejudwrynbxoyzlrqqst.supabase.co/storage/v1/object/public/blogs/image.jpg?token=abc123';
    const path = extractPathFromUrl(url, bucket);
    
    expect(path).toBe('image.jpg');
  });
});
