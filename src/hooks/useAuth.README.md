# useAuth Hook

React hook for authentication state management in the Admin Content Management system.

## Overview

The `useAuth` hook wraps the `apiClient` authentication methods and provides a React-friendly interface for managing authentication state, signing in, and signing out. It handles session persistence, automatic state synchronization, and provides loading states for better UX.

## Features

- ✅ Authentication state management (user, loading, isAuthenticated)
- ✅ Sign in with email and password
- ✅ Sign out functionality
- ✅ Session persistence across page reloads
- ✅ Automatic auth state synchronization
- ✅ Loading states during authentication operations
- ✅ Error handling with user-friendly messages
- ✅ TypeScript support with full type safety

## Requirements

Validates Requirements: 1.2, 1.3, 1.4, 1.5

- **1.2**: User authentication with valid credentials
- **1.3**: Invalid credentials rejection with error messages
- **1.4**: Session state maintenance while active
- **1.5**: Session expiration and logout handling

## Installation

The hook is already available in the project. No additional installation needed.

```typescript
import { useAuth } from '@/hooks/useAuth';
```

## API Reference

### Return Value

```typescript
interface UseAuthReturn {
  user: User | null;              // Current authenticated user
  loading: boolean;               // Loading state during auth operations
  isAuthenticated: boolean;       // Whether user is authenticated
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signOut: () => Promise<{
    success: boolean;
    error?: string;
  }>;
}

interface User {
  id: string;
  email: string;
}
```

### Properties

#### `user`
- **Type**: `User | null`
- **Description**: Current authenticated user information, or `null` if not authenticated
- **Example**: `{ id: 'user-123', email: 'admin@example.com' }`

#### `loading`
- **Type**: `boolean`
- **Description**: Indicates if an authentication operation is in progress
- **Use Cases**: 
  - Show loading spinner during sign in
  - Disable form inputs during authentication
  - Show loading state on initial mount

#### `isAuthenticated`
- **Type**: `boolean`
- **Description**: Quick check if user is currently authenticated
- **Use Cases**:
  - Conditional rendering
  - Route protection
  - Feature access control

### Methods

#### `signIn(email, password)`
- **Parameters**:
  - `email` (string): User email address
  - `password` (string): User password
- **Returns**: `Promise<{ success: boolean; error?: string }>`
- **Description**: Authenticates user with email and password
- **Example**:
  ```typescript
  const result = await signIn('admin@example.com', 'password123');
  if (result.success) {
    // Navigate to dashboard
  } else {
    // Show error: result.error
  }
  ```

#### `signOut()`
- **Returns**: `Promise<{ success: boolean; error?: string }>`
- **Description**: Signs out the current user and clears session
- **Example**:
  ```typescript
  const result = await signOut();
  if (result.success) {
    // Navigate to login page
  }
  ```

## Usage Examples

### Basic Login Form

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Protected Route

```typescript
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### User Profile Display

```typescript
import { useAuth } from '@/hooks/useAuth';

function UserProfile() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    // Redirect handled by auth state change
  };

  return (
    <div>
      <p>Email: {user?.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
```

### Admin Layout with Auth

```typescript
import { useAuth } from '@/hooks/useAuth';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-layout">
      <header>
        <span>{user?.email}</span>
        <button onClick={signOut}>Logout</button>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

## How It Works

### Initialization

1. On mount, the hook fetches the current authentication state from `apiClient.getAuthState()`
2. Sets up a subscription to auth state changes via `apiClient.onAuthStateChange()`
3. Updates local state when auth state changes
4. Cleans up subscription on unmount

### Sign In Flow

1. User calls `signIn(email, password)`
2. Hook sets `loading` to `true`
3. Calls `apiClient.signIn()` with credentials
4. On success:
   - Auth state change listener updates the hook state automatically
   - Returns `{ success: true }`
5. On failure:
   - Sets `loading` to `false`
   - Returns `{ success: false, error: 'Error message' }`

### Sign Out Flow

1. User calls `signOut()`
2. Hook sets `loading` to `true`
3. Calls `apiClient.signOut()`
4. On success:
   - Auth state change listener updates the hook state automatically
   - Returns `{ success: true }`
5. On failure:
   - Sets `loading` to `false`
   - Returns `{ success: false, error: 'Error message' }`

### Session Persistence

- Sessions are persisted by Supabase automatically
- On page reload, `getAuthState()` restores the session
- No manual session management required
- Sessions expire based on Supabase configuration

## Integration with apiClient

The hook uses the following `apiClient` methods:

- `getAuthState()`: Get current authentication state
- `signIn(email, password)`: Authenticate user
- `signOut()`: Sign out user
- `onAuthStateChange(callback)`: Subscribe to auth state changes

See `src/lib/api/apiClient.ts` for implementation details.

## Error Handling

The hook provides user-friendly error messages:

- **Invalid credentials**: "Invalid credentials" or custom message from API
- **Network errors**: "Network error" or custom message
- **Generic errors**: "Authentication failed" or "Sign out failed"

All errors are returned in the response object:

```typescript
const result = await signIn(email, password);
if (!result.success) {
  console.error(result.error); // User-friendly error message
}
```

## Testing

### Unit Tests

The hook includes comprehensive unit tests in `useAuth.test.ts`:

- Initialization and loading states
- Auth state changes
- Sign in success and failure
- Sign out success and failure
- Session persistence
- Error handling
- Edge cases

### Running Tests

```bash
# Install vitest if not already installed
npm install -D vitest @testing-library/react @testing-library/react-hooks

# Add test script to package.json
"test": "vitest"

# Run tests
npm test useAuth.test.ts
```

## Best Practices

### 1. Use Loading State

Always show loading indicators during authentication:

```typescript
const { loading } = useAuth();

return (
  <button disabled={loading}>
    {loading ? 'Signing in...' : 'Sign In'}
  </button>
);
```

### 2. Handle Errors Gracefully

Display user-friendly error messages:

```typescript
const result = await signIn(email, password);
if (!result.success) {
  setError(result.error || 'An error occurred');
}
```

### 3. Redirect After Auth State Changes

Use `useEffect` to handle redirects:

```typescript
const { isAuthenticated } = useAuth();

useEffect(() => {
  if (isAuthenticated) {
    navigate('/admin/dashboard');
  }
}, [isAuthenticated, navigate]);
```

### 4. Protect Routes

Wrap protected routes with authentication checks:

```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
}
```

### 5. Clean Up on Unmount

The hook automatically cleans up subscriptions, but ensure components using it are properly unmounted.

## Common Patterns

### Conditional Rendering

```typescript
const { isAuthenticated } = useAuth();

return isAuthenticated ? <AdminPanel /> : <LoginPage />;
```

### Auth Guard Component

```typescript
function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Spinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
}
```

### User Info Display

```typescript
const { user } = useAuth();

return user ? <div>Welcome, {user.email}</div> : null;
```

## Troubleshooting

### Hook returns loading: true indefinitely

- Check that Supabase client is properly configured
- Verify network connectivity
- Check browser console for errors

### Sign in succeeds but isAuthenticated remains false

- Ensure auth state change listener is working
- Check that Supabase session is being created
- Verify no errors in console

### Session not persisting across page reloads

- Check Supabase configuration
- Verify localStorage is enabled in browser
- Check for CORS issues

## Related Files

- `src/lib/api/apiClient.ts` - API client with auth methods
- `src/hooks/useAuth.test.ts` - Unit tests
- `src/hooks/useAuth.example.tsx` - Usage examples
- `.kiro/specs/admin-content-management/design.md` - Design document

## Next Steps

After implementing `useAuth`, you can:

1. Create `AuthGuard` component (Task 9.1)
2. Create `Login` page component (Task 9.2)
3. Implement protected routes
4. Build admin layout with user info display

## Support

For issues or questions:
1. Check the examples in `useAuth.example.tsx`
2. Review the unit tests in `useAuth.test.ts`
3. Consult the API client documentation in `src/lib/api/README.md`
