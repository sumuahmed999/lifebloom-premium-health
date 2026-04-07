/**
 * useImageUpload Hook
 * 
 * React hook for handling image uploads with progress tracking and validation.
 * 
 * Requirements: 10.2, 10.3, 10.4, 10.6, 10.7
 */

import { useState, useCallback } from 'react';
import { ImageService } from '@/lib/services/ImageService';
import type { StorageBucket } from '@/lib/storage/supabaseStorage';

// ============================================================================
// Types
// ============================================================================

/**
 * Return type for useImageUpload hook
 */
export interface UseImageUploadReturn {
  /** Upload an image file */
  upload: (file: File, bucket: StorageBucket) => Promise<string>;
  /** Whether an upload is in progress */
  uploading: boolean;
  /** Upload progress (0-100) */
  progress: number;
  /** Error message if upload failed */
  error: string | null;
  /** Reset error state */
  clearError: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for image upload operations
 * 
 * @returns Image upload interface with progress tracking
 * 
 * @example
 * ```tsx
 * function ImageUploader() {
 *   const { upload, uploading, progress, error } = useImageUpload();
 *   
 *   const handleFileSelect = async (file: File) => {
 *     try {
 *       const url = await upload(file, 'services');
 *       console.log('Uploaded to:', url);
 *     } catch (err) {
 *       console.error('Upload failed:', err);
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <input type="file" onChange={(e) => handleFileSelect(e.target.files[0])} />
 *       {uploading && <progress value={progress} max={100} />}
 *       {error && <p className="error">{error}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload an image file to the specified bucket
   * 
   * @param file - The image file to upload
   * @param bucket - The storage bucket (services, testimonials, blogs, videos)
   * @returns Promise resolving to the public URL of the uploaded image
   * @throws Error if upload fails
   */
  const upload = useCallback(async (
    file: File,
    bucket: StorageBucket
  ): Promise<string> => {
    // Reset state
    setError(null);
    setProgress(0);
    setUploading(true);

    try {
      // Validate file before upload
      const validation = ImageService.validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid image file');
      }

      // Upload with progress tracking
      const result = await ImageService.upload(
        file,
        bucket,
        (progressValue) => {
          setProgress(progressValue);
        }
      );

      if (!result.success || !result.publicUrl) {
        throw new Error(result.error || 'Upload failed');
      }

      // Success
      setProgress(100);
      return result.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    uploading,
    progress,
    error,
    clearError,
  };
}

export default useImageUpload;
