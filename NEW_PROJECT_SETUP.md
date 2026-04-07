# New Supabase Project Setup Guide

## ✅ Configuration Updated

All configuration files have been updated with your new Supabase project credentials:
- Project ID: `ginifvflddhsltzbroeo`
- URL: `https://ginifvflddhsltzbroeo.supabase.co`

## 🚀 Next Steps - Database Setup

Your new Supabase project is empty. You need to set up the database tables and create an admin user.

### Step 1: Run Database Migrations

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ginifvflddhsltzbroeo`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase/migrations/20240101000000_create_admin_content_tables.sql`
6. Click **Run** (or press Ctrl+Enter)
7. Wait for success message

### Step 2: Create Storage Buckets

1. Still in SQL Editor, click **New Query**
2. Copy and paste the contents of `supabase/migrations/20240101000001_create_storage_buckets.sql`
3. Click **Run**
4. Wait for success message

### Step 3: Create Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `admin@lifebloom.com`
   - Password: `admin123456`
   - ✅ Check "Auto Confirm User" (important!)
4. Click **Create User**

### Step 4: Test the Connection

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Open the diagnostic tool:
   ```
   http://localhost:8080/diagnose-supabase.html
   ```

3. All 5 tests should pass ✅

### Step 5: Test Login

1. Go to: `http://localhost:8080/login`
2. Enter credentials:
   - Email: `admin@lifebloom.com`
   - Password: `admin123456`
3. Click **Sign In**
4. You should be redirected to the dashboard!

## 📁 Migration Files Location

- **Database Tables**: `supabase/migrations/20240101000000_create_admin_content_tables.sql`
- **Storage Buckets**: `supabase/migrations/20240101000001_create_storage_buckets.sql`

## 🔧 What Gets Created

### Database Tables:
- `services` - Service offerings
- `testimonials` - Customer testimonials
- `blog_posts` - Blog articles
- `video_posts` - Video content
- `contact_info` - Contact information
- `admin_users` - Admin user accounts (legacy, using Supabase Auth instead)

### Storage Buckets:
- `service-images` - Service icons/images
- `testimonial-images` - Customer photos
- `blog-images` - Blog post images
- `video-thumbnails` - Video thumbnails

## ⚠️ Important Notes

1. **Auto Confirm User**: Make sure to check "Auto Confirm User" when creating the admin account, otherwise you'll need to confirm the email manually.

2. **Password Requirements**: Supabase requires passwords to be at least 6 characters.

3. **Project Active**: Make sure your Supabase project is not paused. If it shows "PAUSED" in the dashboard, click "Resume Project".

## 🐛 Troubleshooting

If login still doesn't work after setup:

1. **Check project status**: Make sure it's not paused
2. **Verify user exists**: Go to Authentication → Users and confirm the user is there
3. **Check email confirmed**: The user should show as "Confirmed"
4. **Run diagnostics**: Use `diagnose-supabase.html` to identify issues
5. **Check browser console**: Look for any error messages

## 📝 Quick Command Reference

```bash
# Start dev server
npm run dev

# Open in browser
http://localhost:8080

# Login page
http://localhost:8080/login

# Diagnostics
http://localhost:8080/diagnose-supabase.html
```

## ✨ After Setup

Once login works, you can continue with the remaining tasks to build the admin content management UI:
- Dashboard with statistics
- Services management
- Testimonials management
- Blog posts management
- Video content management
- Contact information management
