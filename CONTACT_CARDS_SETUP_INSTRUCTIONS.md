# Contact Cards Setup Instructions

## ⚠️ CRITICAL: Database Migration Required

The error you're seeing (`Could not find the table 'public.contact_cards' in the schema cache`) means the database table hasn't been created yet.

## Quick Fix (2 minutes)

### Step 1: Run the Migration in Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `RUN_CONTACT_CARDS_MIGRATION.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

### Step 2: Verify the Table Was Created

After running the migration, you should see:
```
Success. No rows returned
```

To verify the table exists, run this query:
```sql
SELECT * FROM contact_cards;
```

You should see an empty table (or sample data if you uncommented the INSERT statements).

### Step 3: Refresh Your App

1. Go back to your browser at http://localhost:8082/
2. Refresh the page (F5 or Ctrl+R)
3. The error should be gone!

## What This Migration Does

✅ Creates the `contact_cards` table with all required columns
✅ Sets up indexes for performance (sort_order, status)
✅ Enables Row Level Security (RLS)
✅ Configures policies:
  - Public users can view published cards
  - Authenticated admins can manage all cards
✅ Adds auto-update trigger for `updated_at` timestamp

## Optional: Add Sample Data

If you want to test with sample data immediately, uncomment the INSERT statements at the bottom of `RUN_CONTACT_CARDS_MIGRATION.sql` before running it. This will create 4 sample contact cards:
- Call Us (phone)
- Email Us (mail)
- Visit Us (map-pin)
- Opening Hours (clock)

## After Migration

Once the migration is complete, you can:

1. **Admin Interface**: Navigate to http://localhost:8082/admin/contact-cards
   - Create, edit, delete contact cards
   - Reorder cards with up/down buttons
   - Toggle publish/unpublish status
   - Preview cards in real-time

2. **Frontend Display**: Navigate to http://localhost:8082/
   - Scroll to "Get in Touch" section
   - See published cards displayed
   - Click cards to open modal popups
   - Test CTA buttons (call, email, links)

## Troubleshooting

### If you still see the error after running the migration:

1. **Check if the migration ran successfully**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'contact_cards';
   ```
   Should return: `contact_cards`

2. **Clear browser cache and refresh**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

3. **Restart the dev server**
   - Stop the server (Ctrl+C in terminal)
   - Run `npm run dev` again

4. **Check Supabase connection**
   - Verify `.env` file has correct Supabase credentials
   - Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

## Need Help?

If you encounter any issues:
1. Check the browser console for errors (F12 → Console tab)
2. Check the Supabase logs (Dashboard → Logs)
3. Verify your admin user is authenticated (try logging out and back in)
