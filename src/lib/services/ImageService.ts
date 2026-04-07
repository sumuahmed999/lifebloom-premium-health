/**
 * ImageService
 * 
 * Service layer for image upload and management operations.
 * Provides progress tracking and validation for image uploads.
 * 
 * Requirements: 10.3, 10.4, 10.8
 */

import {
  uploadImage,
  deleteImage,
  validateImageFile,
  type StorageBucket,
  type ValidationResult,
  type UploadResult,
} from '@/lib/storage/supabaseStorage';

/**
 * Progress callback for upload operations
 */
export type ProgressCallback = (progress: number) => void;

/**
 * ImageService class for managing image uploads and deletions
 */
export class ImageService {
  /**
   * Uploads an image file to the specified storage bucket
   * 
   * @param file - The image file to upload
   * @param bucket - The storage bucket (services, testimonials, blogs, videos)
   * @param onProgress - Optional callback for upload progress (0-100)
   * @returns Upload result with public URL or error
   */
  static async upload(
    file: File,
    bucket: StorageBucket,
    onProgress?: ProgressCallback
  ): Promise<UploadResult> {
    try {
      // Validate file before upload
      const validation = this.validateImage(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Report initial progress
      if (onProgress) {
        onProgress(0);
      }

      // Simulate progress during upload
      // Note: Supabase Storage doesn't provide native progress events
      // This is a simplified implementation
      const progressInterval = setInterval(() => {
        if (onProgress) {
          // Increment progress gradually
          const currentProgress = Math.min(90, Math.random() * 30 + 50);
          onProgress(currentProgress);
        }
      }, 100);

      // Perform the upload
      const result = await uploadImage(file, bucket);

      // Clear progress interval
      clearInterval(progressInterval);

      // Report completion
      if (onProgress) {
        onProgress(result.success ? 100 : 0);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Deletes an image from the specified storage bucket
   * 
   * @param bucket - The storage bucket name
   * @param path - The file path within the bucket
   * @returns Success status and optional error message
   */
  static async delete(
    bucket: StorageBucket,
    path: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await deleteImage(bucket, path);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Validates an image file before upload
   * 
   * @param file - The file to validate
   * @param maxSizeMB - Optional maximum file size in MB (defaults to 5MB)
   * @returns Validation result with error message if invalid
   */
  static validateImage(file: File, maxSizeMB: number = 5): ValidationResult {
    // Use the storage utility validation
    const result = validateImageFile(file);
    
    // If a custom max size is provided, check it
    if (result.valid && maxSizeMB !== 5) {
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return {
          valid: false,
          error: `File size exceeds ${maxSizeMB}MB limit. File size: ${sizeMB}MB`
        };
      }
    }

    return result;
  }

  /**
   * Extracts the storage path from a public URL
   * This is useful for deletion operations
   * 
   * @param publicUrl - The public URL of the image
   * @returns The storage path, or null if URL is invalid
   */
  static extractPathFromUrl(publicUrl: string): string | null {
    try {
      const url = new URL(publicUrl);
      const pathParts = url.pathname.split('/');
      
      // Find the bucket name in the path
      const buckets: StorageBucket[] = ['services', 'testimonials', 'blogs', 'videos'];
      for (const bucket of buckets) {
        const bucketIndex = pathParts.indexOf(bucket);
        if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
          return pathParts.slice(bucketIndex + 1).join('/');
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Determines the storage bucket from a public URL
   * 
   * @param publicUrl - The public URL of the image
   * @returns The storage bucket name, or null if not found
   */
  static getBucketFromUrl(publicUrl: string): StorageBucket | null {
    try {
      const url = new URL(publicUrl);
      const pathParts = url.pathname.split('/');
      
      const buckets: StorageBucket[] = ['services', 'testimonials', 'blogs', 'videos'];
      for (const bucket of buckets) {
        if (pathParts.includes(bucket)) {
          return bucket;
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Deletes an image using its public URL
   * Automatically determines the bucket and path
   * 
   * @param publicUrl - The public URL of the image to delete
   * @returns Success status and optional error message
   */
  static async deleteByUrl(
    publicUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    const bucket = this.getBucketFromUrl(publicUrl);
    const path = this.extractPathFromUrl(publicUrl);

    if (!bucket || !path) {
      return {
        success: false,
        error: 'Invalid URL: Could not determine bucket or path'
      };
    }

    return this.delete(bucket, path);
  }
}
