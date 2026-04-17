# Setup Contact Cards Database

## Problem
You're seeing a Supabase error because the `contact_cards` table doesn't exist in your database yet.

## Solution

Follow these steps to create the table and set up the database:

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (einifridmslitzmroco)
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"

### Step 2: Run the Setup Script

1. Open the file: `supabase/RUN_THIS_IN_SUPABASE_CONTACT_CARDS.sql`
2. Copy the entire contents of that file
3. Paste it into the Supabase SQL Editor
4. Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)

### Step 3: Verify Success

After running the script, you should see:
- A success message
- A result showing:
  - Status: "Setup Complete!"
  - Total cards: 4
  - Published cards: 4

### Step 4: Test the Application

1. Refresh your application page
2. The error should be gone
3. You should see 4 default contact cards:
   - Call Us (Phone icon, blue theme)
   - Email Us (Mail icon, green theme)
   - Visit Us (MapPin icon, teal theme)
   - Opening Hours (Clock icon, gray theme)

## What the Script Does

The script performs the following operations:

1. **Creates the trigger function** for auto-updating timestamps
2. **Creates the contact_cards table** with all required fields and constraints
3. **Creates indexes** for efficient querying
4. **Enables Row Level Security (RLS)** to protect your data
5. **Creates RLS policies** for:
   - Public users: Can view published cards only
   - Authenticated admins: Full CRUD access
6. **Creates the update trigger** for the updated_at field
7. **Inserts 4 seed cards** with sample data
8. **Verifies the setup** by counting the cards

## Troubleshooting

### If you get a "function already exists" error:
This is fine - it means the function was already created. The script will continue.

### If you get a "table already exists" error:
This is fine - the script uses `IF NOT EXISTS` to handle this safely.

### If you get a "policy already exists" error:
The script drops existing policies first, so this shouldn't happen. But if it does, you can manually drop the policies in the Supabase dashboard under Authentication > Policies.

### If the seed data doesn't insert:
This might happen if you already have cards with sort_order 0-3. The script uses `ON CONFLICT DO NOTHING` to handle this gracefully.

## Next Steps

After the database is set up:

1. You can create new contact cards through the admin panel
2. Edit existing cards
3. Reorder cards using the up/down arrows
4. Publish/unpublish cards
5. Delete cards you don't need

## Database Schema

The contact_cards table has the following structure:

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key, Auto-generated |
| icon | TEXT | NOT NULL |
| title | TEXT | NOT NULL, 1-100 characters |
| short_description | TEXT | Max 200 characters |
| detailed_content | TEXT | Max 5000 characters |
| cta_button_text | TEXT | Optional |
| cta_link | TEXT | Must start with tel:, mailto:, or https: |
| color_theme | TEXT | Default: 'primary-blue' |
| status | BOOLEAN | Default: false (unpublished) |
| sort_order | INTEGER | UNIQUE, determines display order |
| created_at | TIMESTAMPTZ | Auto-set on creation |
| updated_at | TIMESTAMPTZ | Auto-updated on changes |

## Security

The RLS policies ensure:
- ✅ Public users can only see published cards (status = true)
- ✅ Unauthenticated users cannot create, update, or delete cards
- ✅ Authenticated admins have full access to all cards
- ✅ All operations are logged with timestamps

## Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify your authentication is working
3. Check that RLS is enabled on the table
4. Ensure your admin user is authenticated
