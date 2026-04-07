# Admin Login Testing Guide

## Prerequisites

Before testing, you need to:

1. **Apply database migrations**
2. **Create an admin user**
3. **Start the development server**

## Step 1: Apply Database Migrations

### Option A: Using Supabase CLI (Recommended)

```bash
cd lifebloom-premium-health
supabase db push
```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Run the first migration:
   - Copy contents from `supabase/migrations/20240101000000_create_admin_content_tables.sql`
   - Paste into SQL Editor
   - Click "Run"
4. Run the second migration:
   - Copy contents from `supabase/migrations/20240101000001_create_storage_buckets.sql`
   - Paste into SQL Editor
   - Click "Run"

## Step 2: Create an Admin User

### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** or **"Invite user"**
4. Enter:
   - Email: `admin@lifebloom.com` (or any email you prefer)
   - Password: `admin123456` (or any password, min 6 characters)
5. Click **"Create user"** or **"Send invitation"**

### Option B: Using SQL (Advanced)

```sql
-- This will be handled by Supabase Auth automatically
-- Just use the dashboard method above
```

## Step 3: Start Development Server

```bash
cd lifebloom-premium-health
npm run dev
```

The server should start at `http://localhost:5173`

## Step 4: Test the Login Flow

### Test 1: Redirect to Login
1. Open browser to `http://localhost:5173/admin`
2. **Expected**: You should be redirected to `http://localhost:5173/admin/login`
3. **Result**: ✅ Pass / ❌ Fail

### Test 2: Form Validation
1. Try submitting empty form
2. **Expected**: See validation errors for email and password
3. **Result**: ✅ Pass / ❌ Fail

4. Enter invalid email (e.g., "notanemail")
5. **Expected**: See "Please enter a valid email address" error
6. **Result**: ✅ Pass / ❌ Fail

7. Enter valid email but short password (e.g., "123")
8. **Expected**: See "Password must be at least 6 characters" error
9. **Result**: ✅ Pass / ❌ Fail

### Test 3: Invalid Credentials
1. Enter email: `wrong@example.com`
2. Enter password: `wrongpassword`
3. Click "Sign In"
4. **Expected**: See error message "Invalid email or password" or similar
5. **Result**: ✅ Pass / ❌ Fail

### Test 4: Valid Login
1. Enter the admin email you created (e.g., `admin@lifebloom.com`)
2. Enter the password you set (e.g., `admin123456`)
3. Click "Sign In"
4. **Expected**: 
   - Loading spinner appears briefly
   - Redirected to `http://localhost:5173/admin/dashboard`
   - See the admin dashboard with navigation sidebar
5. **Result**: ✅ Pass / ❌ Fail

### Test 5: Navigation
1. Click "Services" in the sidebar
2. **Expected**: Navigate to `/admin/services` and see placeholder page
3. **Result**: ✅ Pass / ❌ Fail

4. Click "Testimonials" in the sidebar
5. **Expected**: Navigate to `/admin/testimonials` and see placeholder page
6. **Result**: ✅ Pass / ❌ Fail

7. Try all navigation links (Dashboard, Services, Testimonials, Blogs, Videos, Contact)
8. **Expected**: All links work and show placeholder pages
9. **Result**: ✅ Pass / ❌ Fail

### Test 6: Session Persistence
1. While logged in, refresh the page (F5 or Cmd+R)
2. **Expected**: Still logged in, stay on the same page
3. **Result**: ✅ Pass / ❌ Fail

### Test 7: Logout
1. Click the "Logout" button in the sidebar
2. **Expected**: 
   - Redirected to `/admin/login`
   - Session cleared
3. **Result**: ✅ Pass / ❌ Fail

4. Try to access `/admin/dashboard` directly
5. **Expected**: Redirected back to `/admin/login`
6. **Result**: ✅ Pass / ❌ Fail

### Test 8: Mobile Responsiveness
1. Open browser dev tools (F12)
2. Toggle device toolbar (Cmd+Shift+M or Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. **Expected**: 
   - Login page is responsive
   - After login, see hamburger menu icon
   - Sidebar is collapsible
5. **Result**: ✅ Pass / ❌ Fail

## Troubleshooting

### Issue: "Failed to fetch" or network error
**Cause**: Supabase connection issue
**Solution**: 
1. Check `.env` file has correct Supabase URL and key
2. Verify Supabase project is active
3. Check browser console for detailed error

### Issue: "Invalid login credentials"
**Cause**: User doesn't exist or wrong password
**Solution**:
1. Verify user was created in Supabase dashboard
2. Check email and password are correct
3. Try creating a new user

### Issue: Redirects to login immediately after signing in
**Cause**: Auth state not persisting
**Solution**:
1. Check browser console for errors
2. Verify Supabase client is configured correctly
3. Check localStorage is enabled in browser

### Issue: Sidebar doesn't show on mobile
**Cause**: CSS issue
**Solution**:
1. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
2. Check Tailwind CSS is working
3. Verify no console errors

### Issue: TypeScript errors in console
**Cause**: Missing dependencies or type definitions
**Solution**:
```bash
npm install
```

## Expected Results Summary

All tests should pass (✅). If any test fails (❌), check the troubleshooting section above.

## Next Steps After Successful Testing

Once all tests pass, you can:

1. **Continue with remaining tasks**: Build out content management features
2. **Customize the UI**: Update colors, logos, styling
3. **Add more admin users**: Create additional admin accounts
4. **Implement content management**: Services, testimonials, blogs, etc.

## Support

If you encounter issues:
1. Check browser console for errors (F12 → Console tab)
2. Check network tab for failed requests (F12 → Network tab)
3. Review the authentication guide: `docs/AUTHENTICATION_ROUTING_GUIDE.md`
4. Check Supabase dashboard for auth logs

## Quick Reference

**Admin Login URL**: `http://localhost:5173/admin/login`
**Admin Dashboard URL**: `http://localhost:5173/admin/dashboard`
**Default Test Credentials**: 
- Email: `admin@lifebloom.com`
- Password: `admin123456`

(Use the credentials you created in Step 2)
