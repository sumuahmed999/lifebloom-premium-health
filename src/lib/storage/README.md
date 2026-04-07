# Storage Utilities

This directory contains utilities for managing file uploads using Supabase Storage.

## Overview

The admin content management system uses Supabase Storage instead of a local file system for storing uploaded images. This provides:

- Secure cloud storage with built-in CDN
- Automatic file size and type validation
- Public read access for website display
- Authenticated write access for admin users

## Files

### `supabaseStorage.ts`

Core utility functions for interacting with Supabase Storage:

- `validateImageFile(file)` - Validates file type and size before upload
- `uploadImage(file, bucket)` - Uploads an image to a storage bucket
- `deleteImage(bucket, path)` - Deletes an image from a storage bucket
- `getPublicUrl(bucket, path)` - Gets the public URL for a file
- `extractPathFromUrl(publicUrl, bucket)` - Extracts file path from URL
- `listFiles(bucket, path?)` - Lists files in a bucket

## Usage Examples

### Upload an Image

```typescript
import { uploadImage } from '@/lib/storage/supabaseStorage';

async function handleImageUpload(file: File) {
  const result = await uploadImage(file, 'blogs');
  
  if (result.success) {
    console.log('Image uploaded:', result.publicUrl);
    // Save result.publicUrl to database
  } else {
    console.error('Upload failed:', result.error);
  }
}
```

### Delete an Image

```typescript
import { deleteImage, extractPathFromUrl } from '@/lib/storage/supabaseStorage';

async function handleImageDelete(publicUrl: string) {
  const path = extractPathFromUrl(publicUrl, 'blogs');
  
  if (path) {
    const result = await deleteImage('blogs', path);
    
    if (result.success) {
      console.log('Image deleted successfully');
    } else {
      console.error('Delete failed:', result.error);
    }
  }
}
```

### Validate Before Upload

```typescript
import { validateImageFile } from '@/lib/storage/supabaseStorage';

function handleFileSelect(file: File) {
  const validation = validateImageFile(file);
  
  if (!validation.valid) {
    alert(validation.error);
    return;
  }
  
  // Proceed with upload
  uploadImage(file, 'services');
}
```

## Storage Buckets

The system uses four storage buckets:

- `services` - Images for service offerings
- `testimonials` - Customer profile images
- `blogs` - Blog post featured and inline images
- `videos` - Video thumbnail images

## File Constraints

- **Max Size**: 5MB per file
- **Allowed Types**: JPEG, PNG, WebP
- **Naming**: Files are automatically prefixed with timestamp for uniqueness

## Security

All buckets have Row Level Security (RLS) policies:

- Public can read (view/download) files
- Only authenticated users can upload, update, or delete files

## Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **10.2**: File type validation (JPEG, PNG, WebP only)
- **10.3**: Organized file storage (separate buckets per content type)
- **10.4**: Public URL generation for uploaded files
- **10.6**: File size limit enforcement (5MB max)
- **10.7**: Error messages for oversized files
- **10.8**: Thumbnail preview support (via public URLs)
- **10.9**: Image removal functionality

## Migration

Storage buckets are created via SQL migration:
```
supabase/migrations/20240101000001_create_storage_buckets.sql
```

Apply with:
```bash
supabase db push
```

## Testing

When writing tests for components that use storage:

1. Mock the storage functions in tests
2. Test validation logic separately
3. Test error handling for upload failures
4. Verify public URLs are correctly generated

Example mock:
```typescript
vi.mock('@/lib/storage/supabaseStorage', () => ({
  uploadImage: vi.fn().mockResolvedValue({
    success: true,
    publicUrl: 'https://example.com/image.jpg',
    path: '1234567890_image.jpg'
  }),
  validateImageFile: vi.fn().mockReturnValue({ valid: true })
}));
```
