# ContentService

High-level API for content management operations in the Admin Content Management system.

## Overview

The `ContentService` class provides a clean, type-safe interface for managing all content types (services, testimonials, blog posts, video posts, and contact information). It wraps the lower-level `apiClient` and adds:

- **Automatic retry logic** for network errors
- **Error handling** with standardized error responses
- **Type safety** with TypeScript generics
- **Bulk operations** for efficient multi-item updates
- **Content reordering** with sort_order management

## Features

### CRUD Operations
- `getAll()` - Fetch all records with optional filters
- `getById()` - Fetch a single record by ID
- `create()` - Create a new record
- `update()` - Update an existing record
- `delete()` - Delete a record

### Bulk Operations
- `bulkUpdate()` - Update multiple records at once
- `bulkDelete()` - Delete multiple records at once

### Content Management
- `updateOrder()` - Reorder content items by updating sort_order

### Error Handling
- Automatic retry on network errors (up to 3 retries with exponential backoff)
- No retry on authentication errors (immediate failure)
- No retry on validation errors (immediate failure)
- Standardized error responses with error codes

## Usage

### Basic CRUD Operations

```typescript
import { ContentService } from '@/lib/services';
import type { Service } from '@/types/admin-content';

// Fetch all services
const response = await ContentService.getAll<Service>('services');
if (response.success && response.data) {
  console.log('Services:', response.data);
}

// Get a single service by ID
const service = await ContentService.getById<Service>('services', 'service-id');

// Create a new service
const newService = await ContentService.create<Service>('services', {
  title: 'Primary Care',
  description: 'Comprehensive primary care services',
  icon: 'stethoscope',
  features: ['Annual checkups', 'Preventive care'],
  color_scheme: 'blue',
  published: false,
  sort_order: 0,
});

// Update a service
const updated = await ContentService.update<Service>('services', 'service-id', {
  title: 'Updated Title',
  published: true,
});

// Delete a service
await ContentService.delete('services', 'service-id');
```

### Filtering and Search

```typescript
// Filter by published status
const published = await ContentService.getAll<Service>('services', {
  published: true,
});

// Filter by category
const healthBlogs = await ContentService.getAll<BlogPost>('blogs', {
  category: 'health',
});

// Search across multiple fields
const searchResults = await ContentService.getAll<BlogPost>('blogs', {
  search: 'wellness',
});

// Pagination
const page1 = await ContentService.getAll<Service>('services', {
  limit: 10,
  offset: 0,
});
```

### Bulk Operations

```typescript
// Bulk publish multiple services
const result = await ContentService.bulkUpdate<Service>(
  'services',
  ['id1', 'id2', 'id3'],
  { published: true }
);
console.log(`Published ${result.data} services`);

// Bulk delete multiple testimonials
const deleted = await ContentService.bulkDelete(
  'testimonials',
  ['id1', 'id2', 'id3']
);
console.log(`Deleted ${deleted.data} testimonials`);
```

### Content Reordering

```typescript
// Reorder services
const items = [
  { id: 'service-1', sort_order: 0 },
  { id: 'service-2', sort_order: 1 },
  { id: 'service-3', sort_order: 2 },
];

await ContentService.updateOrder('services', items);
```

### Error Handling

```typescript
const response = await ContentService.getAll<Service>('services');

if (response.success && response.data) {
  // Success - use the data
  console.log('Services:', response.data);
} else if (response.error) {
  // Error - handle based on error code
  switch (response.error.code) {
    case 'AUTH_ERROR':
      // Redirect to login
      break;
    case 'NETWORK_ERROR':
      // Show retry message
      break;
    case 'VALIDATION_ERROR':
      // Show validation errors
      break;
    default:
      // Show generic error
      console.error(response.error.message);
  }
}
```

## Content Types

The service supports the following content types:

| Content Type | Table Name | Description |
|-------------|------------|-------------|
| `services` | `services` | Healthcare service offerings |
| `testimonials` | `testimonials` | Customer reviews and feedback |
| `blogs` | `blog_posts` | Blog articles with rich text |
| `videos` | `video_posts` | Video content with metadata |
| `contact` | `contact_info` | Business contact information |

## API Response Format

All methods return a standardized `ApiResponse<T>` object:

```typescript
interface ApiResponse<T> {
  data: T | null;        // The data if successful, null if error
  error: ApiError | null; // The error if failed, null if successful
  success: boolean;       // True if successful, false if error
}

interface ApiError {
  message: string;  // Human-readable error message
  code?: string;    // Error code for programmatic handling
  details?: unknown; // Additional error details
}
```

## Retry Logic

The service automatically retries failed operations with the following configuration:

- **Max retries**: 3 attempts
- **Initial delay**: 1000ms
- **Backoff multiplier**: 2x (1s, 2s, 4s)
- **Retry conditions**: Only network errors are retried
- **No retry**: Authentication errors and validation errors fail immediately

## Type Safety

The service uses TypeScript generics to ensure type safety:

```typescript
// Type-safe service operations
const service = await ContentService.getById<Service>('services', 'id');
// service.data is typed as Service | null

// Type-safe blog operations
const blogs = await ContentService.getAll<BlogPost>('blogs');
// blogs.data is typed as BlogPost[] | null

// Type-safe updates
await ContentService.update<Service>('services', 'id', {
  title: 'New Title', // ✓ Valid
  invalidField: 'value', // ✗ TypeScript error
});
```

## Integration with React Hooks

The ContentService is designed to be used with React hooks:

```typescript
import { useState, useEffect } from 'react';
import { ContentService } from '@/lib/services';
import type { Service } from '@/types/admin-content';

function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      const response = await ContentService.getAll<Service>('services');
      
      if (response.success && response.data) {
        setServices(response.data);
      } else if (response.error) {
        setError(response.error.message);
      }
      
      setLoading(false);
    }

    fetchServices();
  }, []);

  return { services, loading, error };
}
```

## Testing

The ContentService includes comprehensive unit tests covering:

- All CRUD operations
- Bulk operations
- Content reordering
- Error handling
- Retry logic
- Edge cases (empty arrays, null values, etc.)

Run tests with:
```bash
npm test -- ContentService.test.ts
```

## Related Files

- `ContentService.ts` - Main service implementation
- `ContentService.test.ts` - Unit tests
- `ContentService.example.ts` - Usage examples
- `@/lib/api/apiClient.ts` - Lower-level API client
- `@/types/admin-content.ts` - Type definitions

## Requirements Validated

This service validates the following requirements from the spec:

- **2.4, 3.4, 4.4, 5.4, 6.4** - Content creation
- **2.6, 3.6, 4.8, 5.8** - Content updates
- **2.7, 3.7, 4.9, 5.9** - Content deletion
- **8.3, 8.4, 8.5** - Bulk operations
- **14.2** - Content reordering

## See Also

- [API Client Documentation](../api/README.md)
- [Validation Service Documentation](./ValidationService.ts)
- [Admin Content Types](../../types/admin-content.ts)
