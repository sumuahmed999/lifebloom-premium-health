/**
 * ImageService Tests
 * 
 * Unit tests for the ImageService class
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageService } from './ImageService';
import * as storage from '@/lib/storage/supabaseStorage';

// Mock the storage module
vi.mock('@/lib/storage/supabaseStorage', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
  validateImageFile: vi.fn(),
}));

describe('ImageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateImage', () => {
    it('should validate a valid image file', () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      
      vi.mocked(storage.validateImageFile).mockReturnValue({ valid: true });

      const result = ImageService.validateImage(mockFile);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid file type', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      
      vi.mocked(storage.validateImageFile).mockReturnValue({
        valid: false,
        error: 'Invalid file type'
      });

      const result = ImageService.validateImage(mockFile);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject file exceeding size limit', () => {
      // Create a file larger than 5MB
      const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
      const mockFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      
      vi.mocked(storage.validateImageFile).mockReturnValue({
        valid: false,
        error: 'File size exceeds 5MB limit'
      });

      const result = ImageService.validateImage(mockFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('5MB');
    });

    it('should accept custom max size', () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB
      
      vi.mocked(storage.validateImageFile).mockReturnValue({ valid: true });

      const result = ImageService.validateImage(mockFile, 2); // 2MB limit

      expect(result.valid).toBe(false);
      expect(result.error).toContain('2MB');
    });
  });

  describe('upload', () => {
    it('should upload a valid image successfully', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const mockResult = {
        success: true,
        publicUrl: 'https://example.com/test.jpg',
        path: 'test.jpg'
      };

      vi.mocked(storage.validateImageFile).mockReturnValue({ valid: true });
      vi.mocked(storage.uploadImage).mockResolvedValue(mockResult);

      const result = await ImageService.upload(mockFile, 'services');

      expect(result.success).toBe(true);
      expect(result.publicUrl).toBe(mockResult.publicUrl);
      expect(storage.uploadImage).toHaveBeenCalledWith(mockFile, 'services');
    });

    it('should reject invalid file before upload', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      vi.mocked(storage.validateImageFile).mockReturnValue({
        valid: false,
        error: 'Invalid file type'
      });

      const result = await ImageService.upload(mockFile, 'services');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(storage.uploadImage).not.toHaveBeenCalled();
    });

    it('should call progress callback during upload', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const progressCallback = vi.fn();

      vi.mocked(storage.validateImageFile).mockReturnValue({ valid: true });
      vi.mocked(storage.uploadImage).mockResolvedValue({
        success: true,
        publicUrl: 'https://example.com/test.jpg',
        path: 'test.jpg'
      });

      await ImageService.upload(mockFile, 'services', progressCallback);

      expect(progressCallback).toHaveBeenCalled();
      // Should be called with 0 (start), intermediate values, and 100 (complete)
      expect(progressCallback).toHaveBeenCalledWith(0);
      expect(progressCallback).toHaveBeenCalledWith(100);
    });

    it('should handle upload errors', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      vi.mocked(storage.validateImageFile).mockReturnValue({ valid: true });
      vi.mocked(storage.uploadImage).mockResolvedValue({
        success: false,
        error: 'Upload failed'
      });

      const result = await ImageService.upload(mockFile, 'services');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Upload failed');
    });
  });

  describe('delete', () => {
    it('should delete an image successfully', async () => {
      vi.mocked(storage.deleteImage).mockResolvedValue({ success: true });

      const result = await ImageService.delete('services', 'test.jpg');

      expect(result.success).toBe(true);
      expect(storage.deleteImage).toHaveBeenCalledWith('services', 'test.jpg');
    });

    it('should handle delete errors', async () => {
      vi.mocked(storage.deleteImage).mockResolvedValue({
        success: false,
        error: 'Delete failed'
      });

      const result = await ImageService.delete('services', 'test.jpg');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Delete failed');
    });
  });

  describe('extractPathFromUrl', () => {
    it('should extract path from valid Supabase URL', () => {
      const url = 'https://example.supabase.co/storage/v1/object/public/services/123_test.jpg';
      const path = ImageService.extractPathFromUrl(url);

      expect(path).toBe('123_test.jpg');
    });

    it('should return null for invalid URL', () => {
      const path = ImageService.extractPathFromUrl('not-a-url');

      expect(path).toBeNull();
    });

    it('should return null for URL without bucket', () => {
      const url = 'https://example.com/some/path/test.jpg';
      const path = ImageService.extractPathFromUrl(url);

      expect(path).toBeNull();
    });
  });

  describe('getBucketFromUrl', () => {
    it('should extract bucket from valid URL', () => {
      const url = 'https://example.supabase.co/storage/v1/object/public/services/123_test.jpg';
      const bucket = ImageService.getBucketFromUrl(url);

      expect(bucket).toBe('services');
    });

    it('should return null for invalid URL', () => {
      const bucket = ImageService.getBucketFromUrl('not-a-url');

      expect(bucket).toBeNull();
    });

    it('should return null for URL without known bucket', () => {
      const url = 'https://example.com/unknown/path/test.jpg';
      const bucket = ImageService.getBucketFromUrl(url);

      expect(bucket).toBeNull();
    });
  });

  describe('deleteByUrl', () => {
    it('should delete image using public URL', async () => {
      const url = 'https://example.supabase.co/storage/v1/object/public/services/123_test.jpg';
      
      vi.mocked(storage.deleteImage).mockResolvedValue({ success: true });

      const result = await ImageService.deleteByUrl(url);

      expect(result.success).toBe(true);
      expect(storage.deleteImage).toHaveBeenCalledWith('services', '123_test.jpg');
    });

    it('should handle invalid URL', async () => {
      const result = await ImageService.deleteByUrl('invalid-url');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid URL');
      expect(storage.deleteImage).not.toHaveBeenCalled();
    });
  });
});
