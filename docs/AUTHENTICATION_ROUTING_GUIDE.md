# Authentication & Routing Guide

## Quick Start

### Accessing the Admin Panel

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the admin panel**:
   - Go to `http://localhost:5173/admin`
   - You'll be redirected to the login page

3. **Login** (once authentication backend is set up):
   - Enter your admin email and password
   - Click "Sign In"
   - You'll be redirected to the dashboard

### Route Structure

```
Public Routes:
  /                     → Home page
  /admin/login          → Login page

Protected Admin Routes (requires authentication):
  /admin                → Redirects to /admin/dashboard
  /admin/dashboard      → Main dashboard
  /admin/services       → Services management
  /admin/testimonials   → Testimonials management
  /admin/blogs          → Blog posts management
  /admin/videos         → Videos management
  /admin/contact        → Contact info management
```

## Components Overview

### AuthGuard

**Location**: `src/components/AuthGuard.tsx`

**Purpose**: Protects routes from unauthorized access

**How it works**:
1. Checks if user is authenticated using `useAuth` hook
2. Shows loading spinner while checking
3. If not authenticated, redirects to `/admin/login`
4. If authenticated, renders the protected content

**Usage**:
```tsx
<Route path="/admin" element={
  <AuthGuard>
    <AdminLayout />
  </AuthGuard>
} />
```

### Login Page

**Location**: `src/pages/Login.tsx`

**Features**:
- Email and password input fields
- Client-side validation
- Error message display
- Loading states
- Auto-redirect after successful login
- Preserves intended destination

**Validation Rules**:
- Email: Required, must be valid format
- Password: Required, minimum 6 characters

### AdminLayout

**Location**: `src/components/AdminLayout.tsx`

**Features**:
- Responsive sidebar navigation
- User info display
- Logout button
- Active route highlighting
- Mobile-friendly with collapsible menu

**Navigation Links**:
- Dashboard
- Services
- Testimonials
- Blog Posts
- Videos
- Contact Info

## Authentication Flow

### Login Flow

```
User visits /admin
    ↓
AuthGuard checks authentication
    ↓
Not authenticated → Redirect to /admin/login
    ↓
User enters credentials
    ↓
Form validates input
    ↓
signIn() called
    ↓
Success → Redirect to intended destination
    ↓
AdminLayout renders with navigation
```

### Logout Flow

```
User clicks Logout button
    ↓
signOut() called
    ↓
Auth state cleared
    ↓
Redirect to /admin/login
```

## Integration with useAuth Hook

The authentication system uses the `useAuth` hook from Task 8.1:

```typescript
const { 
  user,           // Current user info
  loading,        // Loading state
  isAuthenticated, // Auth status
  signIn,         // Login function
  signOut         // Logout function
} = useAuth();
```

### AuthGuard Usage
```typescript
const { isAuthenticated, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!isAuthenticated) return <Navigate to="/admin/login" />;
return <>{children}</>;
```

### Login Page Usage
```typescript
const { signIn, isAuthenticated } = useAuth();

const handleSubmit = async (email, password) => {
  const result = await signIn(email, password);
  if (result.success) {
    // Redirect handled by useEffect
  } else {
    setError(result.error);
  }
};
```

### AdminLayout Usage
```typescript
const { user, signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  navigate('/admin/login');
};
```

## Responsive Design

### Desktop (≥1024px)
- Fixed sidebar always visible
- Main content area with left padding
- Full navigation menu

### Tablet (768px - 1023px)
- Fixed sidebar always visible
- Slightly narrower layout
- Full navigation menu

### Mobile (<768px)
- Collapsible sidebar with hamburger menu
- Overlay when menu is open
- Top header with menu button
- Full-screen menu when open

## Styling

The implementation uses:
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built components
- **Lucide React**: Icons
- **CSS Transitions**: Smooth animations

### Color Scheme
- Primary: Blue tones
- Background: Light gray/white
- Sidebar: White with subtle border
- Active links: Primary color background
- Hover states: Accent color

## Security Considerations

### Current Implementation
✅ Route protection with AuthGuard
✅ Client-side validation
✅ Loading states prevent race conditions
✅ Intended destination preservation
✅ Auto-redirect if already authenticated

### Future Enhancements
- [ ] Rate limiting on login attempts
- [ ] Password strength requirements
- [ ] Two-factor authentication
- [ ] Session timeout warnings
- [ ] Remember me functionality
- [ ] Password reset flow

## Testing the Implementation

### Manual Testing Steps

1. **Test Unauthenticated Access**:
   - Visit `/admin` without logging in
   - Should redirect to `/admin/login`
   - Try accessing `/admin/dashboard` directly
   - Should redirect to `/admin/login`

2. **Test Login Form**:
   - Try submitting empty form → See validation errors
   - Enter invalid email → See email validation error
   - Enter short password → See password validation error
   - Enter valid credentials → Should login (once backend is ready)

3. **Test Navigation**:
   - After login, click each sidebar link
   - Verify correct page loads
   - Check active link highlighting
   - Test mobile menu on small screen

4. **Test Logout**:
   - Click logout button
   - Should redirect to login page
   - Try accessing `/admin` again
   - Should redirect to login page

### Browser Testing
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Troubleshooting

### Issue: Infinite redirect loop
**Cause**: Auth state not updating correctly
**Solution**: Check Supabase connection and useAuth implementation

### Issue: Login form doesn't submit
**Cause**: Validation errors or missing backend
**Solution**: Check console for errors, verify backend is running

### Issue: Sidebar doesn't show on mobile
**Cause**: CSS classes not applied correctly
**Solution**: Check Tailwind CSS is properly configured

### Issue: Routes not working
**Cause**: React Router configuration issue
**Solution**: Verify BrowserRouter is wrapping Routes component

## Next Steps

Now that authentication and routing are set up, you can:

1. **Implement Dashboard** (Task 10.2):
   - Add real statistics from API
   - Show recent content items
   - Add quick action buttons

2. **Build Content Management Pages**:
   - Services management (Tasks 13.1-13.2)
   - Testimonials management (Tasks 14.1-14.2)
   - Blog posts management (Tasks 15.1-15.3)
   - Videos management (Tasks 17.1-17.3)
   - Contact info management (Tasks 18.1-18.2)

3. **Add Shared Components**:
   - ContentList component (Task 12.1)
   - ImageUploader component (Task 12.2)
   - RichTextEditor component (Task 12.3)

## Resources

- [React Router Documentation](https://reactrouter.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## Support

For issues or questions:
1. Check the completion report: `docs/TASKS_9.1_9.2_23.1_COMPLETION.md`
2. Review the useAuth hook: `src/hooks/useAuth.ts`
3. Check the API client: `src/lib/api/apiClient.ts`
