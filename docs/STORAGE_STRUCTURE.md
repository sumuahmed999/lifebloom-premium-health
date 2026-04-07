# Supabase Storage Structure

## Overview

The admin content management system uses Supabase Storage for file uploads instead of a local file system. This provides secure, scalable cloud storage with built-in CDN capabilities.

## Storage Buckets

The system uses four separate storage buckets, one for each content type:

### 1. Services Bucket (`services`)
- **Purpose**: Store images for service offerings
- **Public Access**: Yes (read-only)
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP
- **Access Pattern**: Public read, authenticated write

### 2. Testimonials Bucket (`testimonials`)
- **Purpose**: Store customer profile images for testimonials
- **Public Access**: Yes (read-only)
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP
- **Access Pattern**: Public read, authenticated write

### 3. Blogs Bucket (`blogs`)
- **Purpose**: Store featured images and inline images for blog posts
- **Public Access**: Yes (read-only)
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP
- **Access Pattern**: Public read, authenticated write

### 4. Videos Bucket (`videos`)
- **Purpose**: Store thumbnail images for video posts
- **Public Access**: Yes (read-only)
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP
- **Access Pattern**: Public read, authenticated write

## File Naming Convention

Files are stored with unique names to prevent collisions:

```
{timestamp}_{original_filename}
```

Example: `1704067200000_hero-image.jpg`

## Storage Policies

All buckets have the following Row Level Security (RLS) policies:

1. **Public Read**: Anyone can view/download files (for public website display)
2. **Authenticated Insert**: Only authenticated admin users can upload files
3. **Authenticated Update**: Only authenticated admin users can update files
4. **Authenticated Delete**: Only authenticated admin users can delete files

## Usage in Code

### Uploading a File

```typescript
import { supabase } from '@/integrations/supabase/client';

async function uploadImage(file: File, bucket: string): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);
  
  return publicUrl;
}
```

### Deleting a File

```typescript
async function deleteImage(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
}
```

### Getting a Public URL

```typescript
function getPublicUrl(bucket: string, path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
}
```

## Migration

The storage buckets are created via the migration file:
```
supabase/migrations/20240101000001_create_storage_buckets.sql
```

To apply the migration:
```bash
supabase db push
```

Or if using Supabase CLI locally:
```bash
supabase migration up
```

## Security Considerations

1. **File Size Limits**: Enforced at the bucket level (5MB max)
2. **MIME Type Validation**: Only image types allowed (JPEG, PNG, WebP)
3. **Authentication Required**: All write operations require authenticated users
4. **Public Read Access**: Files are publicly accessible for website display
5. **No Direct Database Access**: Files are managed through Supabase Storage API

## Requirements Validation

This storage structure satisfies the following requirements:

- **Requirement 10.2**: File type validation (enforced by `allowed_mime_types`)
- **Requirement 10.3**: File storage in organized structure (separate buckets per content type)
- **Requirement 10.4**: Public URL generation for uploaded files
- **Requirement 10.6**: File size limit enforcement (5MB max at bucket level)
- **Requirement 10.7**: Error handling for oversized files (handled by Supabase)
- **Requirement 10.8**: Thumbnail preview (URLs can be used in `<img>` tags)
- **Requirement 10.9**: Remove uploaded images (delete functionality)

## Advantages Over Local File System

1. **Scalability**: No server disk space concerns
2. **CDN**: Built-in global CDN for fast image delivery
3. **Security**: Row Level Security policies at the database level
4. **Backup**: Automatic backups included with Supabase
5. **No Server Configuration**: No need to configure web server for file serving
6. **Cross-Origin**: CORS handled automatically by Supabase
