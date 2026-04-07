# Storage Setup Guide

## Quick Start

This guide explains how to set up and use Supabase Storage for the admin content management system.

## Prerequisites

- Supabase project configured (project_id in `supabase/config.toml`)
- Supabase CLI installed (optional, for local development)
- Admin authentication set up

## Setup Steps

### 1. Apply Storage Migration

The storage buckets are created via a database migration. Apply it using one of these methods:

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/20240101000001_create_storage_buckets.sql`
4. Run the SQL query

#### Option B: Using Supabase CLI
```bash
cd lifebloom-premium-health
supabase db push
```

#### Option C: Using Migration Command
```bash
supabase migration up
```

### 2. Verify Buckets Created

Check that the buckets were created:

1. Go to Supabase Dashboard → Storage
2. You should see four buckets:
   - `services`
   - `testimonials`
   - `blogs`
   - `videos`

### 3. Verify Bucket Settings

Each bucket should have:
- **Public**: Yes (for public read access)
- **File size limit**: 5MB (5242880 bytes)
- **Allowed MIME types**: image/jpeg, image/png, image/webp

### 4. Test Upload (Optional)

Test the storage setup with a simple upload:

```typescript
import { uploadImage } from '@/lib/storage/supabaseStorage';

// In a React component or test
const testUpload = async () => {
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const result = await uploadImage(file, 'services');
  console.log('Upload result:', result);
};
```

## Usage in Components

### ImageUploader Component

When creating the ImageUploader component (Task 12.2), use the storage utilities:

```typescript
import { uploadImage, validateImageFile } from '@/lib/storage/supabaseStorage';

const ImageUploader = ({ onUploadComplete, category }) => {
  const handleFileSelect = async (file: File) => {
    // Validate first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Upload
    const result = await uploadImage(file, category);
    if (result.success) {
      onUploadComplete(result.publicUrl);
    } else {
      setError(result.error);
    }
  };

  // ... rest of component
};
```

### Content Forms

When creating content forms (Tasks 13.1, 14.1, 15.1, 17.1), integrate the ImageUploader:

```typescript
import ImageUploader from '@/components/ImageUploader';

const BlogPostForm = () => {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <form>
      {/* Other fields */}
      
      <ImageUploader
        category="blogs"
        currentImageUrl={imageUrl}
        onUploadComplete={(url) => setImageUrl(url)}
      />
      
      {/* Rest of form */}
    </form>
  );
};
```

## Bucket Usage by Content Type

| Content Type | Bucket | Used For |
|-------------|--------|----------|
| Services | `services` | Service offering images |
| Testimonials | `testimonials` | Customer profile photos |
| Blog Posts | `blogs` | Featured images and inline images |
| Video Posts | `videos` | Video thumbnail images |

## File Management

### Uploading Files

```typescript
import { uploadImage } from '@/lib/storage/supabaseStorage';

const result = await uploadImage(file, 'blogs');
if (result.success) {
  // Save result.publicUrl to database
  await saveToDatabase({ image_url: result.publicUrl });
}
```

### Deleting Files

When deleting content, also delete associated images:

```typescript
import { deleteImage, extractPathFromUrl } from '@/lib/storage/supabaseStorage';

// Extract path from stored URL
const path = extractPathFromUrl(imageUrl, 'blogs');

if (path) {
  await deleteImage('blogs', path);
}
```

### Getting Public URLs

Public URLs are automatically generated during upload. To get a URL for an existing file:

```typescript
import { getPublicUrl } from '@/lib/storage/supabaseStorage';

const url = getPublicUrl('blogs', '1704067200000_image.jpg');
```

## Security Notes

1. **Authentication Required**: All upload/delete operations require authenticated users
2. **Public Read**: All files are publicly readable (for website display)
3. **File Validation**: Type and size validation happens before upload
4. **RLS Policies**: Row Level Security enforced at database level

## Troubleshooting

### Upload Fails with "Policy violation"

**Cause**: User is not authenticated

**Solution**: Ensure user is logged in before attempting upload

```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Redirect to login
}
```

### Upload Fails with "File too large"

**Cause**: File exceeds 5MB limit

**Solution**: Validation should catch this before upload. Check that `validateImageFile` is called first.

### Upload Fails with "Invalid MIME type"

**Cause**: File type not allowed

**Solution**: Only JPEG, PNG, and WebP are allowed. Validate with `validateImageFile` before upload.

### Cannot Delete File

**Cause**: Incorrect file path or user not authenticated

**Solution**: Use `extractPathFromUrl` to get the correct path from the public URL.

## Next Steps

After setting up storage:

1. ✅ Storage buckets created (Task 1.3)
2. ⏭️ Implement ImageUploader component (Task 12.2)
3. ⏭️ Integrate with content forms (Tasks 13.1, 14.1, 15.1, 17.1)
4. ⏭️ Add image deletion when content is deleted
5. ⏭️ Write tests for storage operations

## References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- Project Documentation: `docs/STORAGE_STRUCTURE.md`
- Code Documentation: `src/lib/storage/README.md`
