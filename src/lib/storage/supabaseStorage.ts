/**
 * Supabase Storage Utility
 * 
 * Provides helper functions for uploading, deleting, and managing files
 * in Supabase Storage buckets for admin content management.
 * 
 * Validates: Requirements 10.2, 10.3, 10.4, 10.6, 10.7, 10.8, 10.9
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Valid storage bucket names for content types
 */
export type StorageBucket = 'services' | 'testimonials' | 'blogs' | 'videos';

/**
 * Allowed image MIME types
 */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Result of file validation
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Result of file upload operation
 */
export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  path?: string;
  error?: string;
}

/**
 * Validates an image file before upload
 * 
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): ValidationResult {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: JPEG, PNG, WebP. Got: ${file.type}`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds 5MB limit. File size: ${sizeMB}MB`
    };
  }

  return { valid: true };
}

/**
 * Generates a unique filename with timestamp prefix
 * 
 * @param originalFilename - The original filename
 * @returns Unique filename with timestamp
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  // Sanitize filename: remove special characters except dots and dashes
  const sanitized = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${timestamp}_${sanitized}`;
}

/**
 * Uploads an image file to a Supabase Storage bucket
 * 
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @returns Upload result with public URL or error
 */
export async function uploadImage(
  file: File,
  bucket: StorageBucket
): Promise<UploadResult> {
  try {
    // Validate file before upload
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return {
      success: true,
      publicUrl,
      path: data.path
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Deletes a file from a Supabase Storage bucket
 * 
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns Success status and optional error message
 */
export async function deleteImage(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return {
        success: false,
        error: `Delete failed: ${error.message}`
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Gets the public URL for a file in a storage bucket
 * 
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns Public URL for the file
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Extracts the file path from a Supabase Storage public URL
 * 
 * @param publicUrl - The public URL
 * @param bucket - The storage bucket name
 * @returns The file path, or null if URL is invalid
 */
export function extractPathFromUrl(
  publicUrl: string,
  bucket: StorageBucket
): string | null {
  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.indexOf(bucket);
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      return null;
    }
    
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
}

/**
 * Lists all files in a storage bucket
 * 
 * @param bucket - The storage bucket name
 * @param path - Optional path prefix to filter files
 * @returns Array of file objects
 */
export async function listFiles(
  bucket: StorageBucket,
  path?: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path);

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data;
}
