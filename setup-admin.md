# Quick Admin Setup

## 🚀 Quick Start (3 Steps)

### 1. Apply Migrations

Run this in your terminal:

```bash
cd lifebloom-premium-health
```

Then choose one option:

**Option A - Supabase CLI** (if installed):
```bash
supabase db push
```

**Option B - Manual** (via Supabase Dashboard):
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Copy and run `supabase/migrations/20240101000000_create_admin_content_tables.sql`
5. Copy and run `supabase/migrations/20240101000001_create_storage_buckets.sql`

### 2. Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Enter:
   - **Email**: `admin@lifebloom.com`
   - **Password**: `admin123456`
4. Click "Create user"

### 3. Start Dev Server

```bash
npm run dev
```

Then open: **http://localhost:5173/admin**

## ✅ Test Login

1. You'll be redirected to login page
2. Enter:
   - Email: `admin@lifebloom.com`
   - Password: `admin123456`
3. Click "Sign In"
4. You should see the admin dashboard! 🎉

## 📱 What You Can Do

- ✅ Navigate between admin pages (Dashboard, Services, Testimonials, etc.)
- ✅ Logout and login again
- ✅ Session persists across page refreshes
- ✅ Mobile responsive (try resizing browser)

## 🐛 Troubleshooting

**Can't login?**
- Check Supabase dashboard → Authentication → Users (user should exist)
- Check browser console for errors (F12)
- Verify `.env` file has correct Supabase credentials

**Redirects to login after signing in?**
- Check browser console for errors
- Try clearing browser cache/cookies
- Verify Supabase project is active

**Need help?**
- See full guide: `ADMIN_LOGIN_TEST_GUIDE.md`
- Check auth guide: `docs/AUTHENTICATION_ROUTING_GUIDE.md`

## 🎯 Next Steps

After successful login, you can:
1. Continue building content management features
2. Customize the admin panel UI
3. Add more admin users
4. Implement CRUD operations for content

---

**Quick Links:**
- Login: http://localhost:5173/admin/login
- Dashboard: http://localhost:5173/admin/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
