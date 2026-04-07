# API Client Utility

A thin wrapper around the Supabase client that provides consistent error handling, type-safe operations, authentication state management, and response formatting for content management operations.

## Overview

The API client utility simplifies working with Supabase by providing:

- **Consistent Error Handling**: All operations return a standardized `ApiResponse<T>` format
- **Type Safety**: Full TypeScript support with generic types
- **Authentication Management**: Built-in auth state tracking and session handling
- **Response Formatting**: Uniform response structure across all operations
- **Automatic User Tracking**: Automatically adds `created_by` and `updated_by` fields

## Installation

```typescript
import { apiClient } from '@/lib/api';
// or
import apiClient from '@/lib/api/apiClient';
```

## API Response Format

All API operations return a standardized response:

```typescript
interface ApiResponse<T> {
  data: T | null;        // The result data (null on error)
  error: ApiError | null; // Error details (null on success)
  success: boolean;       // Quick success check
}

interface ApiError {
  message: string;   // Human-readable error message
  code?: string;     // Error code for programmatic handling
  details?: unknown; // Additional error details
}
```

## Authentication

### Get Current Auth State

```typescript
const authState = await apiClient.getAuthState();

if (authState.isAuthenticated) {
  console.log('User:', authState.user.email);
}
```

### Sign In

```typescript
const result = await apiClient.signIn('admin@example.com', 'password');

if (result.success) {
  console.log('Signed in as:', result.data.user.email);
} else {
  console.error('Sign in failed:', result.error.message);
}
```

### Sign Out

```typescript
const result = await apiClient.signOut();

if (result.success) {
  console.log('Signed out successfully');
}
```

### Listen to Auth State Changes

```typescript
const subscription = apiClient.onAuthStateChange((state) => {
  if (state.isAuthenticated) {
    console.log('User signed in:', state.user.email);
  } else {
    console.log('User signed out');
  }
});

// Cleanup when done
subscription.unsubscribe();
```

## CRUD Operations

### Fetch All Records

```typescript
// Basic fetch
const result = await apiClient.fetchAll<Service>('services');

if (result.success) {
  console.log('Services:', result.data);
}

// With filters and options
const result = await apiClient.fetchAll<BlogPost>('blog_posts', {
  filters: { published: true, category: 'health' },
  orderBy: { column: 'created_at', ascending: false },
  limit: 10,
  offset: 0,
});
```

### Fetch Single Record

```typescript
const result = await apiClient.fetchById<Service>('services', 'service-id-123');

if (result.success) {
  console.log('Service:', result.data);
} else {
  console.error('Not found:', result.error.message);
}
```

### Create Record

```typescript
const newService = {
  title: 'Primary Care',
  description: 'Comprehensive primary care services',
  icon: 'stethoscope',
  features: ['Annual checkups', 'Preventive care'],
  color_scheme: '#3b82f6',
  published: false,
  sort_order: 0,
};

const result = await apiClient.create<Service>('services', newService);

if (result.success) {
  console.log('Created service:', result.data.id);
  // Note: created_by is automatically added if user is authenticated
}
```

### Update Record

```typescript
const updates = {
  title: 'Updated Title',
  published: true,
};

const result = await apiClient.update<Service>('services', 'service-id-123', updates);

if (result.success) {
  console.log('Updated service:', result.data);
  // Note: updated_by is automatically added if user is authenticated
}
```

### Delete Record

```typescript
const result = await apiClient.delete('services', 'service-id-123');

if (result.success) {
  console.log('Service deleted');
}
```

### Bulk Update

```typescript
const ids = ['id-1', 'id-2', 'id-3'];
const updates = { published: true };

const result = await apiClient.bulkUpdate<Service>('services', ids, updates);

if (result.success) {
  console.log(`Updated ${result.data} records`);
}
```

### Bulk Delete

```typescript
const ids = ['id-1', 'id-2', 'id-3'];

const result = await apiClient.bulkDelete('services', ids);

if (result.success) {
  console.log(`Deleted ${result.data} records`);
}
```

### Search Records

```typescript
const result = await apiClient.search<BlogPost>(
  'blog_posts',
  'health tips',
  ['title', 'excerpt', 'content']
);

if (result.success) {
  console.log('Found posts:', result.data);
}
```

## Error Handling

### Check Error Types

```typescript
import { isAuthError, isNetworkError } from '@/lib/api';

const result = await apiClient.fetchAll('services');

if (!result.success) {
  if (isAuthError(result.error)) {
    // Redirect to login
    console.log('Authentication required');
  } else if (isNetworkError(result.error)) {
    // Show retry option
    console.log('Network error, please try again');
  } else {
    // Generic error handling
    console.error('Error:', result.error.message);
  }
}
```

### Error Codes

Common error codes you might encounter:

- `PGRST301` - Authentication required
- `PGRST116` - No rows found / constraint violation
- `AUTH_ERROR` - Custom authentication error
- `NETWORK_ERROR` - Network connectivity issue
- `UNKNOWN_ERROR` - Unexpected error

## Usage Examples

### Complete CRUD Flow

```typescript
import { apiClient } from '@/lib/api';
import type { Service } from '@/types/admin-content';

// Create
const createResult = await apiClient.create<Service>('services', {
  title: 'Cardiology',
  description: 'Heart health services',
  icon: 'heart',
  features: ['ECG', 'Stress tests'],
  color_scheme: '#ef4444',
  published: false,
  sort_order: 0,
});

if (!createResult.success) {
  console.error('Create failed:', createResult.error.message);
  return;
}

const serviceId = createResult.data.id;

// Read
const readResult = await apiClient.fetchById<Service>('services', serviceId);

// Update
const updateResult = await apiClient.update<Service>('services', serviceId, {
  published: true,
});

// Delete
const deleteResult = await apiClient.delete('services', serviceId);
```

### With React Hook

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { Service } from '@/types/admin-content';

function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      const result = await apiClient.fetchAll<Service>('services', {
        filters: { published: true },
        orderBy: { column: 'sort_order', ascending: true },
      });

      if (result.success) {
        setServices(result.data);
      } else {
        setError(result.error.message);
      }
      setLoading(false);
    }

    loadServices();
  }, []);

  return { services, loading, error };
}
```

## Best Practices

1. **Always check `success` before accessing `data`**
   ```typescript
   const result = await apiClient.fetchAll('services');
   if (result.success) {
     // Safe to use result.data
   }
   ```

2. **Use type parameters for type safety**
   ```typescript
   const result = await apiClient.fetchAll<Service>('services');
   // result.data is typed as Service[]
   ```

3. **Handle errors appropriately**
   ```typescript
   if (!result.success) {
     if (isAuthError(result.error)) {
       // Redirect to login
     } else {
       // Show error message
     }
   }
   ```

4. **Leverage automatic user tracking**
   - `created_by` is automatically added on create
   - `updated_by` is automatically added on update
   - No need to manually pass user IDs

5. **Use search for text queries**
   ```typescript
   // Instead of manual filtering
   const result = await apiClient.search('blog_posts', searchTerm, ['title', 'content']);
   ```

## Testing

The API client is fully tested with unit tests. See `apiClient.test.ts` for examples.

```typescript
import { apiClient } from '@/lib/api';

// Mock Supabase in your tests
vi.mock('@/integrations/supabase/client');

// Test your code that uses apiClient
```

## Related

- [Supabase Client](../../integrations/supabase/client.ts) - The underlying Supabase client
- [Admin Content Types](../../types/admin-content.ts) - TypeScript interfaces for content
- [Validation Service](../services/ValidationService.ts) - Input validation utilities
